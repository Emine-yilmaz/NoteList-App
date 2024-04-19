// ! Gerekli HTML elementlerini sec
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

//* Duzenleme secenekleri
let editElement;
let editFlag = false; //duzenleme modunda olup olmadigini belirtir
let editID = ""; // Duzenleme yapilan ogenin benzersiz kimligi

//! Fonksiyonlar

const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Add";
};

const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
// Tikladigimiz article etiketini ekrandan kaldiracak fonksiyondur.
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; // article etiketine eristik
  const id = element.dataset.id;
  list.removeChild(element); // list etiketi icerisinden article etiketini kaldirdik
  displayAlert("Item Removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
};

const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; // article etiketine parentElement sayesinde eristik
  editElement = e.currentTarget.parentElement.previousElementSibling; // butonun kapsayicisina eristikten sonra kapsayicinin kardes etiketine ulastik
  // Tikladigimiz article etiketi icerisindeki p etiketinin textini inputun icerisine gonderme
  grocery.value = editElement.innerText;

  editFlag = true;
  editID = element.dataset.id; //duzenlenen ogenin kimligine erisme
  submitBtn.textContent = "Edit"; // Duzenleme isleminde submitBtn icerik kismini guncelledik
};

const addItem = (e) => {
  e.preventDefault(); //* Formun otomatik olarak gonderilmesini engeller.
  const value = grocery.value; //* Form icerisinde bulunan inputun degerini alir.
  const id = new Date().getTime().toString(); //* Benzersiz bir id olusturduk.

  // Eger input bos degilse ve duzenleme modunda degilse calisacak blok yapisi
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); // Yeni bir article etiketi olusturduk
    let attr = document.createAttribute("data-id"); // Yeni bir veri kimligi olusturduk
    attr.value = id;
    element.setAttributeNode(attr); // Olusturdugumuz id yi article etiketine ekledi
    element.classList.add("grocery-item"); // Olusturdugumuz article etiketine class ekledik

    element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
               <button class="edit-btn">
                 <i class="fa-solid fa-pen-to-square"></i>
               </button>
               <button class="delete-btn">
                 <i class="fa-solid fa-trash"></i>
               </button>
            </div>
    
    `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    // Kapsayiciya olusturdugumuz article etiketini ekledik
    list.appendChild(element);
    displayAlert("Added Successfully", "success");
    container.classList.add("show-container");
    // local storage ekleme
    addToLocalStorage(id, value);
    // degerleri varsayilana cevirir
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    // Degistirecegimiz p etiketinin icerik kismina kullanicinin inputa girdigi degeri gonderdik
    editElement.innerText = value;
    // Ekrana alert yapisini bastirdik
    displayAlert("Item Updated", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  }
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  // Listede oge varsa calisir
  if (items.lenght > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  // container yapisini gizledik
  container.classList.remove("show-container");
  displayAlert("No Items", "danger");
  setBackToDefault();
  let localItems = getLocalStorage()
  
  localItems=[]
  localStorage.setItem("list", JSON.stringify(localItems));
};
const createListItem = (id, value) => {
  const element = document.createElement("article"); // Yeni bir article etiketi olusturduk
  let attr = document.createAttribute("data-id"); // Yeni bir veri kimligi olusturduk
  attr.value = id;
  element.setAttributeNode(attr); // Olusturdugumuz id yi article etiketine ekledi
  element.classList.add("grocery-item"); // Olusturdugumuz article etiketine class ekledik

  element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
               <button class="edit-btn">
                 <i class="fa-solid fa-pen-to-square"></i>
               </button>
               <button class="delete-btn">
                 <i class="fa-solid fa-trash"></i>
               </button>
            </div>
    `;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // Kapsayiciya olusturdugumuz article etiketini ekledik
  list.appendChild(element);
  container.classList.add("show-container");
};

const setupItems = () => {
  let items = getLocalStorage();
//   console.log("local",items.length);
  if (items.length > 0) {
    items.forEach((item) => {
        // console.log("local",item);
      createListItem(item.id, item.value);
    });
  }
};
/* local storage */
// yerel depoya oge ekleme islemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  
  localStorage.setItem("list", JSON.stringify(items));
};

// yerel depodan ogeleri alma islemi
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

// localStoragedan veriyi silme
const removeFromLocalStorage = (id) => {
  // localStorageda bulunan verileri getir
  let items = getLocalStorage();
  // tikladigim etiketin id si ile localStorageda ki id esit degilse bunu diziden cikar ve yeni bir elemana aktar
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
 
  localStorage.setItem("list", JSON.stringify(items));
};
// Yerel depoda update islemi
const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  // yerel depodaki verilerin id ile guncellenecek olan verinin id si birbirine esit ise inputa girilen value degiskeninin al
  // localStorageda bulunan verinin valuesuna aktar
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};
//! Olay Izleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

