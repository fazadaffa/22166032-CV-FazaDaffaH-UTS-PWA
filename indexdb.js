// Membuka atau membuat database IndexedDB
let db;
const request = indexedDB.open("emailDB", 1);

// Menjalankan kode jika database berhasil dibuat atau di-upgrade
request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("emails", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("email", "email", { unique: true });
};

// Menjalankan kode jika database berhasil dibuka
request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database siap digunakan.");
};

request.onerror = function(event) {
    console.error("Database tidak dapat dibuka:", event.target.errorCode);
};

// Fungsi untuk menyimpan email ke IndexedDB
function saveEmail() {
    const emailInput = document.getElementById("emailInput").value;
    if (emailInput) {
        const transaction = db.transaction(["emails"], "readwrite");
        const objectStore = transaction.objectStore("emails");
        const request = objectStore.add({ email: emailInput });

        request.onsuccess = function() {
            console.log("Email berhasil disimpan:", emailInput);
            alert("Email berhasil disimpan!");
        };

        request.onerror = function(event) {
            console.error("Gagal menyimpan email:", event.target.errorCode);
            alert("Gagal menyimpan email.");
        };
    } else {
        alert("Masukkan alamat email terlebih dahulu.");
    }
}
