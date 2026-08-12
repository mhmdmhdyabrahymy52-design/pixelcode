/* ============================================
   DB.JS
   ============================================ */

var PixelDB = {
    name: 'PixelCodeDB',
    version: 1,
    storeName: 'files',
    db: null
};

function openPixelDB() {
    return new Promise(function(resolve, reject) {
        var request = indexedDB.open(PixelDB.name, PixelDB.version);
        
        request.onupgradeneeded = function(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains(PixelDB.storeName)) {
                db.createObjectStore(PixelDB.storeName, { keyPath: 'id' });
            }
        };
        
        request.onsuccess = function(e) {
            PixelDB.db = e.target.result;
            resolve(PixelDB.db);
        };
        
        request.onerror = function(e) {
            reject(e.target.error);
        };
    });
}

function saveFileToDB(fileData) {
    return new Promise(function(resolve, reject) {
        var transaction = PixelDB.db.transaction([PixelDB.storeName], 'readwrite');
        var store = transaction.objectStore(PixelDB.storeName);
        var request = store.put(fileData);
        request.onsuccess = function() { resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}

function getAllFilesFromDB() {
    return new Promise(function(resolve, reject) {
        var transaction = PixelDB.db.transaction([PixelDB.storeName], 'readonly');
        var store = transaction.objectStore(PixelDB.storeName);
        var request = store.getAll();
        request.onsuccess = function() { resolve(request.result || []); };
        request.onerror = function() { reject(request.error); };
    });
}

function getFileFromDB(id) {
    return new Promise(function(resolve, reject) {
        var transaction = PixelDB.db.transaction([PixelDB.storeName], 'readonly');
        var store = transaction.objectStore(PixelDB.storeName);
        var request = store.get(id);
        request.onsuccess = function() { resolve(request.result); };
        request.onerror = function() { reject(request.error); };
    });
}

function deleteFileFromDB(id) {
    return new Promise(function(resolve, reject) {
        var transaction = PixelDB.db.transaction([PixelDB.storeName], 'readwrite');
        var store = transaction.objectStore(PixelDB.storeName);
        var request = store.delete(id);
        request.onsuccess = function() { resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}