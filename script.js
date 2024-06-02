document.getElementById('btnRC4').addEventListener('click', function() {
  toggleInfo('infoRC4');
});

document.getElementById('btnSalsa20').addEventListener('click', function() {
  toggleInfo('infoSalsa20');
});

document.getElementById('btnChaCha20').addEventListener('click', function() {
  toggleInfo('infoChaCha20');
});

function toggleInfo(infoId) {
  var infoBlock = document.getElementById(infoId);
  if (infoBlock.style.display === 'block') {
    infoBlock.style.display = 'none';
  } else {
    infoBlock.style.display = 'block';
  }
}


// Функция для копирования текста в буфер обмена
function copyToClipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";  // Убираем текстарею из визуальной части страницы
    document.body.appendChild(textarea);
    textarea.focus();  // Фокус на текстарею
    textarea.select();  // Выбираем текст
    document.execCommand('copy');  // Копируем текст в буфер обмена
    document.body.removeChild(textarea);  // Удаляем текстарею
}

// Обработчик события для кнопки копирования ключа
document.getElementById("copyKeyButton").addEventListener("click", function() {
    var key = document.getElementById("key").value;
    copyToClipboard(key);  // Копируем ключ
    alert("Ключ скопирован в буфер обмена.");
});

// Обработчик события для кнопки копирования зашифрованного текста
document.getElementById("copyButton").addEventListener("click", function() {
    var encryptedText = document.getElementById("outputText").value;
    copyToClipboard(encryptedText);  // Копируем зашифрованный текст
    alert("Зашифрованный текст скопирован в буфер обмена.");
});

// Функция для шифрования текста с помощью алгоритма RC4
function encrypt() {
    var inputText = document.getElementById("inputText").value;
    var key = document.getElementById("key").value;
    var encryptedText = rc4(key, inputText);
    document.getElementById("outputText").value = encryptedText;
}

// Функция для дешифрования текста с помощью алгоритма RC4
function decrypt() {
    var inputText = document.getElementById("inputText").value;
    var key = document.getElementById("key").value;
    var decryptedText = rc4(key, inputText);
    document.getElementById("outputText").value = decryptedText;
}

// Функция для генерации случайного ключа и его автоматического ввода в поле для ключа
function generateKey() {
    var keyLength = 16; // Длина ключа (можно изменить по желанию)
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Допустимые символы для ключа
    var key = "";
    for (var i = 0; i < keyLength; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        key += charset[randomIndex];
    }
    document.getElementById("key").value = key;
}

// Функция для шифрования и дешифрования текста с помощью алгоритма RC4
function rc4(key, str) {
    var s = [], j = 0, x, res = '';
    for (var i = 0; i < 256; i++) {
        s[i] = i;
    }
    for (i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }
    i = j = 0;
    for (var y = 0; y < str.length; y++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
}

'use strict'
/*
 * Copyright (c) 2017, Bubelich Mykola
 * https://www.bubelich.com
 *
 * (｡◕‿‿◕｡)
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met, 0x
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * ChaCha20 is a stream cipher designed by D. J. Bernstein.
 * It is a refinement of the Salsa20 algorithm, and it uses a 256-bit key.
 *
 * ChaCha20 successively calls the ChaCha20 block function, with the same key and nonce, and with successively increasing block counter parameters.
 * ChaCha20 then serializes the resulting state by writing the numbers in little-endian order, creating a keystream block.
 *
 * Concatenating the keystream blocks from the successive blocks forms a keystream.
 * The ChaCha20 function then performs an XOR of this keystream with the plaintext.
 * Alternatively, each keystream block can be XORed with a plaintext block before proceeding to create the next block, saving some memory.
 * There is no requirement for the plaintext to be an integral multiple of 512 bits.  If there is extra keystream from the last block, it is discarded.
 *
 * The inputs to ChaCha20 are
 * - 256-bit key
 * - 32-bit initial counter
 * - 96-bit nonce.  In some protocols, this is known as the Initialization Vector
 * - Arbitrary-length plaintext
 *
 * Implementation derived from chacha-ref.c version 20080118
 * See for details, 0x http, 0x//cr.yp.to/chacha/chacha-20080128.pdf
 */

/**
 *
 * @param {Uint8Array} key
 * @param {Uint8Array} nonce
 * @param {number} counter
 * @throws {Error}
 *
 * @constructor
 */
var JSChaCha20 = function (key, nonce, counter) {
  if (typeof counter === 'undefined') {
    counter = 0
  }

  if (!(key instanceof Uint8Array) || key.length !== 32) {
    throw new Error('Key should be 32 byte array!')
  }

  if (!(nonce instanceof Uint8Array) || nonce.length !== 12) {
    throw new Error('Nonce should be 12 byte array!')
  }

  this._rounds = 20
  // Constants
  this._sigma = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]

  // param construction
  this._param = [
    this._sigma[0],
    this._sigma[1],
    this._sigma[2],
    this._sigma[3],
    // key
    this._get32(key, 0),
    this._get32(key, 4),
    this._get32(key, 8),
    this._get32(key, 12),
    this._get32(key, 16),
    this._get32(key, 20),
    this._get32(key, 24),
    this._get32(key, 28),
    // counter
    counter,
    // nonce
    this._get32(nonce, 0),
    this._get32(nonce, 4),
    this._get32(nonce, 8)
  ]

  // init 64 byte keystream block //
  this._keystream = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]

  // internal byte counter //
  this._byteCounter = 0
}

JSChaCha20.prototype._chacha = function () {
  var mix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  var b = 0

  // copy param array to mix //
  for (i = 0; i < 16; i++) {
    mix[i] = this._param[i]
  }

  // mix rounds //
  for (i = 0; i < this._rounds; i += 2) {
    this._quarterround(mix, 0, 4, 8, 12)
    this._quarterround(mix, 1, 5, 9, 13)
    this._quarterround(mix, 2, 6, 10, 14)
    this._quarterround(mix, 3, 7, 11, 15)

    this._quarterround(mix, 0, 5, 10, 15)
    this._quarterround(mix, 1, 6, 11, 12)
    this._quarterround(mix, 2, 7, 8, 13)
    this._quarterround(mix, 3, 4, 9, 14)
  }

  for (i = 0; i < 16; i++) {
    // add
    mix[i] += this._param[i]

    // store keystream
    this._keystream[b++] = mix[i] & 0xFF
    this._keystream[b++] = (mix[i] >>> 8) & 0xFF
    this._keystream[b++] = (mix[i] >>> 16) & 0xFF
    this._keystream[b++] = (mix[i] >>> 24) & 0xFF
  }
}

/**
 * The basic operation of the ChaCha algorithm is the quarter round.
 * It operates on four 32-bit unsigned integers, denoted a, b, c, and d.
 *
 * @param {Array} output
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @private
 */
JSChaCha20.prototype._quarterround = function (output, a, b, c, d) {
  output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 16)
  output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 12)
  output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 8)
  output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 7)

  // JavaScript hack to make UINT32 :) //
  output[a] >>>= 0
  output[b] >>>= 0
  output[c] >>>= 0
  output[d] >>>= 0
}

/**
 * Little-endian to uint 32 bytes
 *
 * @param {Uint8Array|[number]} data
 * @param {number} index
 * @return {number}
 * @private
 */
JSChaCha20.prototype._get32 = function (data, index) {
  return data[index++] ^ (data[index++] << 8) ^ (data[index++] << 16) ^ (data[index] << 24)
}

/**
 * Cyclic left rotation
 *
 * @param {number} data
 * @param {number} shift
 * @return {number}
 * @private
 */
JSChaCha20.prototype._rotl = function (data, shift) {
  return ((data << shift) | (data >>> (32 - shift)))
}

/**
 *  Encrypt data with key and nonce
 *
 * @param {Uint8Array} data
 * @return {Uint8Array}
 */
JSChaCha20.prototype.encrypt = function (data) {
  return this._update(data)
}

/**
 *  Decrypt data with key and nonce
 *
 * @param {Uint8Array} data
 * @return {Uint8Array}
 */
JSChaCha20.prototype.decrypt = function (data) {
  return this._update(data)
}

/**
 *  Encrypt or Decrypt data with key and nonce
 *
 * @param {Uint8Array} data
 * @return {Uint8Array}
 * @private
 */
JSChaCha20.prototype._update = function (data) {
  if (!(data instanceof Uint8Array) || data.length === 0) {
    throw new Error('Data should be type of bytes (Uint8Array) and not empty!')
  }

  var output = new Uint8Array(data.length)

  // core function, build block and xor with input data //
  for (var i = 0; i < data.length; i++) {
    if (this._byteCounter === 0 || this._byteCounter === 64) {
      // generate new block //

      this._chacha()
      // counter increment //
      this._param[12]++

      // reset internal counter //
      this._byteCounter = 0
    }

    output[i] = data[i] ^ this._keystream[this._byteCounter++]
  }

  return output
}

// EXPORT //
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JSChaCha20
}