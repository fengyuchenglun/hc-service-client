'use strict';

const crypto = require('crypto');
const debug = require('debug')('hc-service-client');

function signature(options) {
  const method = options.method || 'GET';
  const accept = options.accept;
  const contentType = options.contentType;
  const path = options.path;
  const date = options.date;
  const content = options.content;
  const accessKeyId = options.accessKeyId;
  const accessKeySecret = options.accessKeySecret;
  const log = options.log;
  const signatureHeader = options.signatureHeader;

  const headers = {};
  let stringToSign;
  if (['POST', 'PUT', 'PATCH'].indexOf(method) >= 0) {
    let contentMd5 = crypto.createHash('md5').update(content, 'utf8').digest('base64');
    stringToSign = `${method}\n${accept}\n${contentMd5}\n${contentType}\n${date}\n${path}`;
    headers['Content-MD5'] = contentMd5;
  } else {
    // 没有content也需要用\n补齐
    stringToSign = `${method}\n${accept}\n\n${contentType}\n${date}\n${path}`;
    options.data = {};
  }
  let signature = crypto.createHmac('sha1', accessKeySecret).update(stringToSign, 'utf8').digest('base64');
  debug('beSignStr: ', stringToSign);
  log.debug('beSignStr: ', stringToSign);

  headers[signatureHeader || 'Authorization'] = `honeybee ${accessKeyId}:${signature}`;
  return headers;
}

module.exports = signature;
