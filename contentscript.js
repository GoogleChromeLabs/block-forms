/**
 * MIT License

Copyright (c) 2021 Clay Smith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

document.addEventListener("DOMContentLoaded", function (event) {
    checkform()
});

async function checkform() {
    const domain = await getStorage('domain')
    let allowlist = await getStorage('allowlist') || []
    let blocklist = await getStorage('blocklist') || []
    let blockall = false

    if (allowlist && allowlist.length > 0) {
        allowlist = allowlist.map(e => e.toString().toLowerCase())
    }

    if (blocklist && blocklist.length > 0) {
        blocklist = blocklist.map(e => e.toString().toLowerCase())
    }

    if(domain && blocklist.includes('*')){
        blockall=true
    }

    let external = document.querySelector('.v1CNvb.sId0Ce')
    if(!external){
        external = document.querySelector('.freebirdFormviewerViewFooterDisclaimer')
    }
    console.log('.freebirdFormviewerViewFooterDisclaimer',external)
    if (!external) {
        return
    }

    const block = external.innerText.includes(chrome.i18n.getMessage('outside')) || external.innerText.includes(chrome.i18n.getMessage('endorsed'))

    const a = external.querySelectorAll('a')
    const regex = /(?:[\w-]+\.)+[\w-]+/gi;
    const testformdomain = external.innerText.match(regex)

    let formdomain
    if (testformdomain) {
        formdomain = testformdomain[0].toString().toLowerCase()
    }

    function test(e) {
        return e.includes(formdomain)
    }

    console.log('domain',formdomain, 'allowlist', allowlist, allowlist.some(test), 'blocklist',blocklist, blocklist.some(test))

    if (allowlist.some(test)) {
        return
    }

    if (block || a.length >= 3 || blocklist.some(test) || blockall) {
        rewrite()
    }
}

function rewrite() {
    newHTML = `<html>
  <head>
    <title>Blocked Form</title>
  </head>
  <body>
    <p>This form originates outside the domain and is thereby blocked.</p>
  </body>
</html>`

    document.open()
    document.write(newHTML)
    document.close()
}

function getStorage(item) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(item, (res) => {
            resolve(res[item])
        })
    })
}


