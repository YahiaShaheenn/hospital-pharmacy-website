const medicines = [
    {
        name: "Panadol",
        costPrice: 30,
        sellingPrice: 50,
        stock: 40,
        minStock: 10,
        sold: 120,
        expiryDate: "2026-12-01"
    },

    {
        name: "Brufen",
        costPrice: 40,
        sellingPrice: 70,
        stock: 5,
        minStock: 10,
        sold: 90,
        expiryDate: "2027-01-10"
    },

    {
        name: "Augmentin",
        costPrice: 80,
        sellingPrice: 120,
        stock: 3,
        minStock: 8,
        sold: 70,
        expiryDate: "2024-03-15"
    }
];


let totalSales = 0;

for(let i = 0; i < medicines.length; i++) {
    totalSales += medicines[i].sellingPrice * medicines[i].sold;
}
console.log(totalSales);


let totalProfit = 0;

for(let i = 0; i < medicines.length; i++) {
    totalProfit += (medicines[i].sellingPrice - medicines[i].costPrice) * medicines[i].sold;
}  
console.log(totalProfit);


let expiredMedicines = [];

for(let i = 0; i < medicines.length; i++){

    if(new Date(medicines[i].expiryDate) < new Date()){
        expiredMedicines.push(medicines[i]);
    }
}


let lowStockMedicines = [];

for(let i = 0; i < medicines.length; i++){

    if(medicines[i].stock <= medicines[i].minStock){
        lowStockMedicines.push(medicines[i]);
    }
}


document.getElementById("totalsales").textContent = totalSales +"EGP";
document.getElementById("totalprofit").textContent = totalProfit +"EGP";
document.getElementById("expmeds").textContent = expiredMedicines.length;
document.getElementById("lowstock").textContent = lowStockMedicines.length;



const dateElement = document.getElementById("date");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
});