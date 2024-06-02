// Константы
const ROTATE_LEFT = (n, b) => ((n << b) | (n >>> (32 - b))); // Сдвиг влево
const Salsa20_WORD = (a, b) => (a ^ b); // XOR двух слов

// Класс Salsa20
class Salsa20 {
    constructor(key, nonce, counter) {
        this.key = key;
        this.nonce = nonce;
        this.counter = counter;
    }

    // Функция для получения ключа
    _getKeyStream() {
        let j0 = 0x61707865, j1 = 0x3320646e, j2 = 0x79622d32, j3 = 0x6b206574; // Константы

        let x = new Array(16);
        let input = new Array(16);

        for (let i = 0; i < 16; i++) {
            input[i] = (this.key[i * 4] & 0xff) | ((this.key[i * 4 + 1] & 0xff) << 8) |
                ((this.key[i * 4 + 2] & 0xff) << 16) | ((this.key[i * 4 + 3] & 0xff) << 24);
        }

        for (let i = 0; i < 16; i++) {
            x[i] = input[i];
        }

        for (let i = 0; i < 4; i++) {
            x[i + 4] = Salsa20_WORD(x[i], j0);
            x[i + 8] = Salsa20_WORD(x[i + 5], j1);
            x[i + 12] = Salsa20_WORD(x[i + 10], j2);
        }

        let block = new Array(64);
        for (let i = 0; i < 64; ++i) {
            let byte = i % 4;
            block[i] = (x[i >>> 2] >>> (8 * byte)) & 0xff;
        }

        return block;
    }

    // Функция для шифрования текста
    encrypt(plaintext) {
        // Преобразуем текст в массив байтов с использованием кодировки UTF-8
        let inputBytes = new TextEncoder().encode(plaintext);

        let output = new Uint8Array(inputBytes.length); // Создаем Uint8Array для хранения зашифрованных байтов
        let keyStream = this._getKeyStream();

        for (let i = 0; i < inputBytes.length; ++i) {
            output[i] = inputBytes[i] ^ keyStream[i]; // Шифруем каждый байт и записываем результат в массив байтов
        }

        return output; // Возвращаем массив байтов, а не строку
    }

    // Функция для дешифрования текста
    decrypt(ciphertext) {
        let output = new Uint8Array(ciphertext.length); // Создаем Uint8Array для хранения дешифрованных байтов
        let keyStream = this._getKeyStream();

        for (let i = 0; i < ciphertext.length; ++i) {
            output[i] = ciphertext[i] ^ keyStream[i]; // Дешифруем каждый байт и записываем результат в массив байтов
        }

        // Преобразуем массив байтов в строку с использованием кодировки UTF-8
        let plaintext = new TextDecoder().decode(output);

        return plaintext;
    }
}

// Функция для копирования ключа Salsa20
function copySalsa20Key() {
    var key = document.getElementById('salsa20Key').value; // Получаем ключ
    copyToClipboard(key); // Копируем ключ в буфер обмена
    alert("Ключ скопирован!");
}

// Функция для копирования зашифрованного текста Salsa20
function copyEncryptedSalsa20Text() {
    var ciphertext = document.getElementById('salsa20OutputText').value; // Получаем зашифрованный текст
    copyToClipboard(ciphertext); // Копируем зашифрованный текст в буфер обмена
    alert("Зашифрованный текст скопирован!");
}

// Функция для генерации случайного ключа Salsa20
function generateSalsa20Key() {
    var key = new Uint8Array(32); // 256 бит
    window.crypto.getRandomValues(key); // Генерируем случайное значение для ключа
    document.getElementById('salsa20Key').value = arrayBufferToBase64(key); // Преобразуем ключ в base64 и выводим в поле ввода
}

// Функция для шифрования текста с помощью Salsa20
function encryptSalsa20() {
    var plaintext = document.getElementById('salsa20InputText').value; // Получаем текст для шифрования
    var key = base64ToArrayBuffer(document.getElementById('salsa20Key').value); // Получаем ключ и преобразуем из base64 в массив байт
    var nonce = new Uint8Array(12); // Создаем nonce (12 байт)
    window.crypto.getRandomValues(nonce); // Генерируем случайное значение для nonce
    var salsa20 = new Salsa20(key, nonce, 0); // Создаем экземпляр Salsa20
    var ciphertext = salsa20.encrypt(plaintext); // Шифруем текст
    document.getElementById('salsa20OutputText').value = arrayBufferToBase64(ciphertext); // Выводим зашифрованный текст
}

// Функция для дешифрования текста с помощью Salsa20
function decryptSalsa20() {
    var ciphertextBytes = base64ToArrayBuffer(document.getElementById('salsa20InputText').value); // Получаем зашифрованный текст в виде массива байтов
    var key = base64ToArrayBuffer(document.getElementById('salsa20Key').value); // Получаем ключ и преобразуем из base64 в массив байт
    var nonce = new Uint8Array(12); // Создаем nonce (12 байт)
    window.crypto.getRandomValues(nonce); // Генерируем случайное значение для nonce
    var salsa20 = new Salsa20(key, nonce, 0); // Создаем экземпляр Salsa20
    var plaintext = salsa20.decrypt(ciphertextBytes); // Дешифруем текст
    document.getElementById('salsa20OutputText').value = plaintext; // Выводим дешифрованный текст
}

// Вспомогательная функция для преобразования массива байт в строку base64
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Вспомогательная функция для преобразования строки base64 в массив байт
function base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

// Привязка функций к элементам кнопок
document.getElementById('generateSalsa20KeyButton').addEventListener('click', generateSalsa20Key);
document.getElementById('encryptSalsa20Button').addEventListener('click', encryptSalsa20);
document.getElementById('decryptSalsa20Button').addEventListener('click', decryptSalsa20);
document.getElementById('copyKeyButtonsalsa').addEventListener('click', copySalsa20Key);
document.getElementById('copyEncryptedSalsa20TextButton').addEventListener('click', copyEncryptedSalsa20Text);
