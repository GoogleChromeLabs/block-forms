/* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License. */

/**
 * Set the User Domain in the storage
 */
chrome.storage.managed.get('domain', function (data) {
  data.type = 'domain';
  chrome.storage.local.set(data);
});

/**
 * Set the Allowlist of domains in the storage
 */
chrome.storage.managed.get('allowlist', function (data) {
  data.type = 'allowlist';
  chrome.storage.local.set(data);

});

/**
 * Set the Blocklist of domains in the storage
 */
chrome.storage.managed.get('blocklist', function (data) {
  data.type = 'blocklist';
  chrome.storage.local.set(data);
});
