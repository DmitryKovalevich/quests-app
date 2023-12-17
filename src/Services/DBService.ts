import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { addDoc, collection, doc, Firestore, getDoc, getDocs, getFirestore, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";
import { Observer } from "../Abstract/Observer";
import { TCriteria, TDataBasket, TDataGraph, TDataHistory, TDataUser, TGood, TGoodBasket } from "../Abstract/Type";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { GoodCard } from "../Common/GoodCard";

export class DBService extends Observer {
  private db: Firestore = getFirestore(this.DBFirestore);

  dataUser: TDataUser | null = null;

  dataBasket: TDataBasket = {
    summa: 0,
    percent: 0,
    allSumma: 0,
    count: 0
  };

  constructor(private DBFirestore: FirebaseApp) {
    super();
  }

  async getDataUser(user: User | null): Promise<void> {
    if (user === null) return;

    const docRef = doc(this.db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.dataUser = docSnap.data() as TDataUser;
      // console.log(docSnap.data());
    } else {
      const data = {
        email: user.email,
        name: user.displayName,
        fotoUrl: user.photoURL,
        basket: [],
      };
      await setDoc(doc(this.db, "users", user.uid), data);
      const docSetSnap = await getDoc(docRef);
      this.dataUser = docSetSnap.data() as TDataUser || null;
      console.log("create documemt");
    }
  }
  async getAllGood(criteria: TCriteria): Promise<TGood[]> {
    const crit = [];
    if (criteria.age != 'all') crit.push(where("age", "==", Number(criteria.age)));
    if (criteria.difficulti === "up") {
      crit.push(orderBy("price", "asc"));
    } else {
      crit.push(orderBy("price", "desc"));
    }
    const q = query(collection(this.db, 'quests'), ...crit);
    const querySnapshot = await getDocs(q);
    const storage = getStorage();
    const flowers = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const uri = ref(storage, data.url);
      const url = await getDownloadURL(uri);
      const flower = {
        name: data.name as string,
        price: data.price as number,
        age: data.age as number,
        difficulti: data.difficulti as number,
        url: url,
        id: doc.id
      };
      return flower;
    });
    return Promise.all(flowers);
  }
  async addGoodInBasket(user: User | null, good: TGood): Promise<void> {
    if (!user || !this.dataUser) return;
    let newBasketItem = { good: good, count: 1 } as TGoodBasket;
    // Проверяем, есть ли уже товар в корзине
    const existingGoodIndex = this.dataUser.basket.findIndex(el => el.good !== null);
    if (existingGoodIndex >= 0) {
      // Если товар уже есть, заменяем его на новый товар
      this.dataUser.basket[existingGoodIndex].good = good;
    } else {
      // Если товара еще нет, добавляем его в корзину
      newBasketItem = {
        good: good,
        count: 1
      } as TGoodBasket;

      this.dataUser.basket.push(newBasketItem);
    }

    // Сохраняем изменения в базе данных
    await setDoc(doc(this.db, "users", user.uid), this.dataUser)
      .then(() => {
        this.calcDataBasket(user);
        this.dispatch('goodInBasket', newBasketItem);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => {

      });
  }

  async delBookFromBasket(user: User | null, good: TGoodBasket): Promise<void> {
    if (!user || !this.dataUser) return;

    const newBasket = this.dataUser.basket.filter((el) => el.good.id !== good.good.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket = newBasket;

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket(user);
        this.dispatch('delGoodFromBasket', good.good.id);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => { })
  }
  calcCostGood(count: number, price: number): number {
    const cost = count * price;
    return cost;
  }
  async calcDataBasket(user: User | null): Promise<void> { //высчитывает общую сумму корзины
    if (!user || !this.dataUser) return;
    let summa = 0;
    let count = 0;
    let count1 = 0;
    this.dataUser.basket.forEach(el => {
      summa += el.count * Number(el.good.price);
      count += el.count;
      count1 += 1;
    })
    let percent = count >= 8 ? 10 : count >= 5 ? 5 : 0;
    const allSumma = summa - summa * percent / 100;

    this.dataBasket.summa = summa;
    this.dataBasket.percent = summa * percent / 100;
    this.dataBasket.allSumma = allSumma;
    this.dataBasket.count = count;
  }
  async changeGoodInBasket(user: User | null, goodBasket: TGoodBasket): Promise<void> { //изменение количества книг в корзине
    if (!user || !this.dataUser) return;

    const index = this.dataUser.basket.findIndex((el) => el.good.id === goodBasket.good.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket[index] = goodBasket;

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket(user);
        this.dispatch("changeDataBasket", this.dataBasket);
      })
      .catch(() => { });
  }
  async addBasketInHistory(user: User | null): Promise<void> {//добавление корзины в историю
    if (!user || !this.dataUser) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser)
    newUser.basket = [];

    const dataHistory = {
      basket: this.dataUser.basket,
      dataBasket: this.dataBasket,
      date: Timestamp.now()
    };

    await addDoc(collection(this.db, 'users', user.uid, 'history'), dataHistory)
      .then(async () => {
        await setDoc(doc(this.db, 'users', user.uid), newUser)
          .then(() => {
            if (!this.dataUser) throw "БД отсутствует";
            this.dataUser.basket.forEach((el) => {
              this.dispatch('delBookFromBasket', el.good.id);
            })
            this.dispatch('addInHistory', dataHistory)
            this.dataUser = newUser;
            this.calcDataBasket(user);
            this.dispatch('clearBasket');
            this.dispatch('changeDataBasket', this.dataBasket);
            this.calcCountDocsHistory(user);
          })
          .catch(() => { });
      })
      .catch(() => { });
  }
  async calcCountDocsHistory(user: User | null): Promise<void> {//считает количество документов в истории
    if (!user || !this.dataUser) return;

    const querySnapshot = await getDocs(collection(this.db, "users", user.uid, "history"));
    const count = querySnapshot.docs.length;
    let summa = 0;
    querySnapshot.docs.forEach(el => {
      summa += el.data().dataBasket.count;
    })
    this.dispatch('changeStat', count, summa);
  }
  async getAllHistory(user: User | null): Promise<TDataHistory[]> {
    if (!user || !this.dataUser) return [];
    const querySnapshot = await getDocs(collection(this.db, 'users', user.uid, 'history'));
    const rez = querySnapshot.docs.map((doc) => {
      const data = doc.data() as TDataHistory;
      data.id = doc.id;
      return data;
    })
    return rez;
  }
  updateDataGraph(histories: TDataHistory[]): TDataGraph[] {
    const data = {} as Record<string, number>;
    histories.forEach((el) => {
      const dataString = el.date.toDate().toDateString()
      if (data[dataString]) {
        data[dataString] += el.dataBasket.count;
      } else {
        data[dataString] = el.dataBasket.count;
      }
    });
    const sortData = [];
    for (const day in data) {
      sortData.push({
        x: new Date(day),
        y: data[day]
      });
    }
    return sortData.sort(
      (a, b) => a.x.getMilliseconds() - b.x.getMilliseconds()
    );
  }
}