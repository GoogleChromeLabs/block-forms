/* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* you may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License. */

/**
 * Trigger the check on load of the DOM
 */
document.addEventListener("DOMContentLoaded", function (event) {
  checkform();
});

/**
 * Check that the form is allowed
 * @returns void
 */
async function checkform() {
  let organization = await getStorage('organization') || await getStorage('domain');
  let allowlist = await getStorage('allowlist') || [];
  let blocklist = await getStorage('blocklist') || [];
  let blockall = false;
  if (allowlist && allowlist.length > 0) {
    allowlist = allowlist.map(e => e.toString().toLowerCase());
  }

  if (blocklist && blocklist.length > 0) {
    blocklist = blocklist.map(e => e.toString().toLowerCase());
  }

  if (blocklist.includes('*')) {
    blockall = true;
  }

  let external = document.querySelector('.v1CNvb.sId0Ce');
  if (!external) {
    external = document.querySelector('.freebirdFormviewerViewFooterDisclaimer');
  }

  if (!external) {
    return;
  }

  const block = external.innerText.includes(chrome.i18n.getMessage('outside')) || external.innerText.includes(chrome.i18n.getMessage('endorsed'));
  const a = external.querySelectorAll('a');
  const footer = external.textContent;

  let formFooter = '';
  if (footer) {
    formFooter = footer.toString().toLowerCase().trim();
  }

  const regex = /(?:[\w-]+\.)+[\w-]+/gi;
  const testformdomain = external.innerText.match(regex);
  let formdomain;
  if (testformdomain) {
    formdomain = testformdomain[0].toString().toLowerCase();
  }

  function test(e) {
    if (!e) return false;
    const target = e.toLowerCase().trim();
    if (formdomain && (formdomain === target || formdomain.endsWith('.' + target))) {
      return true;
    }
    if (formFooter && target.length > 2 && formFooter.includes(target)) {
      return true;
    }
    return false;
  }

  if ([organization, ...allowlist].filter(Boolean).some(test)) {
    return;
  }

  if (block || !formdomain || a.length >= 3 || blocklist.some(test) || blockall) {
    rewrite();
  }
}

function rewrite() {
  document.title = 'Blocked Form';
  const newBodyHTML = `
    <div style="padding: 2em; font-family: sans-serif; text-align: center;">
      <h1>Access Denied</h1>
      <p>This form originates outside the domain and is thereby blocked.</p>
    </div>
  `;
  document.body.innerHTML = newBodyHTML;
}

/**
 * Get the values from Storage
 * @param {string} item -Storage item
 * @returns
 */
function getStorage(item) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(item, (res) => {
      resolve(res[item]);
    });
  });
}


