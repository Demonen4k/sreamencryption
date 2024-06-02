document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateChaCha20KeyButton").addEventListener("click", generateChaCha20Key);
  document.getElementById("encryptChaCha20Button").addEventListener("click", encryptChaCha20);
  document.getElementById("decryptChaCha20Button").addEventListener("click", decryptChaCha20);
  document.getElementById("copyKeyButtonChaCha").addEventListener("click", copyKeyChaCha);
  document.getElementById("copyEncryptedChaCha20TextButton").addEventListener("click", copyEncryptedChaCha20Text);
});


// Функция для копирования ключа ChaCha20 в буфер обмена
function copyKeyChaCha() {
  var keyInput = document.getElementById('chacha20Key');
  copyToClipboard(keyInput.value);
  alert('Ключ скопирован в буфер обмена');
}

// Функция для копирования зашифрованного текста ChaCha20 в буфер обмена
function copyEncryptedChaCha20Text() {
  var ciphertextInput = document.getElementById('chacha20OutputText');
  copyToClipboard(ciphertextInput.value);
  alert('Текст скопирован в буфер обмена');
}

'use strict';

// Функция генерации случайного ключа для ChaCha20
function generateChaCha20Key() {
  var key = new Uint8Array(32);
  window.crypto.getRandomValues(key);

  var hexKey = Array.prototype.map.call(key, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');

  document.getElementById('chacha20Key').value = hexKey;
}

// Функция для зашифрования текста
function encryptChaCha20() {
  var plaintext = document.getElementById('chacha20InputText').value;
  var keyHex = document.getElementById('chacha20Key').value;

  // Преобразуем ключ из hex в байты
  var keyBytes = new Uint8Array(32);
  for (var i = 0; i < keyHex.length; i += 2) {
    keyBytes[i / 2] = parseInt(keyHex.substr(i, 2), 16);
  }

  // Создаем экземпляр ChaCha20 с заданным ключом
  var chacha20 = new JSChaCha20(keyBytes, new Uint8Array(12)); // nonce не используется

  // Преобразуем текст в байты
  var plaintextBytes = new TextEncoder().encode(plaintext);

  // Зашифруем текст
  var ciphertextBytes = chacha20.encrypt(plaintextBytes);

  // Преобразуем зашифрованные байты в строку hex
  var ciphertextHex = Array.prototype.map.call(ciphertextBytes, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');

  // Выведем зашифрованный текст в соответствующее поле
  document.getElementById('chacha20OutputText').value = ciphertextHex;
}

// Функция для дешифрования текста
function decryptChaCha20() {
  var ciphertextHex = document.getElementById('chacha20OutputText').value;
  var keyHex = document.getElementById('chacha20Key').value;

  // Преобразуем ключ из hex в байты
  var keyBytes = new Uint8Array(32);
  for (var i = 0; i < keyHex.length; i += 2) {
    keyBytes[i / 2] = parseInt(keyHex.substr(i, 2), 16);
  }

  // Создаем экземпляр ChaCha20 с заданным ключом
  var chacha20 = new JSChaCha20(keyBytes, new Uint8Array(12)); // nonce не используется

  // Преобразуем зашифрованный текст из hex в байты
  var ciphertextBytes = new Uint8Array(ciphertextHex.length / 2);
  for (var j = 0; j < ciphertextHex.length; j += 2) {
    ciphertextBytes[j / 2] = parseInt(ciphertextHex.substr(j, 2), 16);
  }

  // Дешифруем текст
  var decryptedBytes = chacha20.decrypt(ciphertextBytes);

  // Преобразуем дешифрованные байты в строку
  var decryptedText = new TextDecoder().decode(decryptedBytes);

  // Выведем дешифрованный текст
  document.getElementById('chacha20OutputText').value = decryptedText;
}

