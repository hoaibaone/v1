module.exports = function ({
    api,
    config,
    __GLOBAL,
    User,
    Thread,
    Rank,
    Economy,
    Fishing,
    Nsfw,
    Image
}) {
    function getText(...args) {
        const langText = __GLOBAL.language.event;
        const getKey = args[0];
        if (!langText.hasOwnProperty(getKey)) throw `${__filename} - Not found key language: ${getKey}`;
        let text = langText[getKey];
        for (let i = args.length; i > 0; i--) {
            let regEx = RegExp(`%${i}`, 'g');
            text = text.replace(regEx, args[i]);
        }
        return text;
    }

    const fs = require('fs-extra');
    const eval = require("eval");
    const axios = require('axios');

    const request = require('request');

    return async function ({
        event
    }) {
        let {
            threadID,
            messageID,
            senderID,
            body
        } = event;
        const admins = config.admins;

        senderID = parseInt(senderID);
        threadID = parseInt(threadID);
        if (__GLOBAL.userBlocked.includes(senderID) && !admins.includes(senderID) || __GLOBAL.threadBlocked.includes(threadID) && !admins.includes(senderID)) return;

        const pf = config.prefix;
        //Do code here
        if (!fs.existsSync(__dirname + '/src/checktt.json')) fs.writeFileSync(__dirname + '/src/checktt.json', JSON.stringify({}));
        const checkttdata = JSON.parse(fs.readFileSync(__dirname + '/src/checktt.json'));
        if (!checkttdata[threadID]) checkttdata[threadID] = {};
        if (!checkttdata[threadID][senderID]) checkttdata[threadID][senderID] = 0;
        checkttdata[threadID][senderID] += 1;
        fs.writeFileSync(__dirname + '/src/checktt.json', JSON.stringify(checkttdata));

        if (body.indexOf(`${pf}gang`) == 0) {
            let content = body.split(' ');
            var storage = [];
            var rankdata = JSON.parse(fs.readFileSync(__dirname + '/src/checktt.json'));
            for (i of Object.keys(rankdata)) {
                let total = 0;
                for (e of Object.keys(rankdata[i])) {
                    total += rankdata[i][e];
                }
                storage.push({
                    id: i,
                    score: total
                });
                storage.sort((a, b) => {
                    if (a.score > b.score) return -1;
                    if (a.score < b.score) return 1;
                    if (a.id > b.id) return 1;
                    if (a.id < b.id) return -1;
                });
            }
            if (!content[1]) {
                let msg = '=======GANG=======';
                let gangInfo = await api.getThreadInfo(threadID);
                let name = '\nName: ' + gangInfo.name;
                let mem = '\nMembers: ' + gangInfo.participantIDs.length;
                const rank = storage.findIndex(info => parseInt(info.id) == parseInt(threadID)) + 1;
                const gangdata = storage[rank - 1];
                msg += name + mem + '\nScore: ' + gangdata.score + '\nRank: ' + rank;
                api.sendMessage(msg, threadID);
            } else if (content[1] == 'all') {
                let msg = '=======GANGS=======\n',
                    number = 0;
                for (e of storage) {
                    let name = (await api.getThreadInfo(e.id)).name
                    number += 1;
                    msg += number + '. ' + name + ' v???i ' + e.score + ' ??i???m.\n';
                }
                api.sendMessage(msg, threadID);
            } else api.sendMessage('Sai format', threadID);
        }

        if (body.indexOf(`${pf}checktt`) == 0 || body.indexOf(`${pf}check`) == 0) {
            let content = body.split(' ');
            let data = JSON.parse(fs.readFileSync(__dirname + '/src/checktt.json'));
            let getInfo = await api.getThreadInfo(threadID);
            var uinfo = getInfo.userInfo;
            var storage = [];
            for (i of uinfo) {
                if (!data[threadID][i.id]) data[threadID][i.id] = 0;
                storage.push({
                    id: i.id,
                    name: i.name,
                    count: data[threadID][i.id]
                });
            }
            storage.sort((a, b) => {
                if (a.count > b.count) return -1;
                if (a.count < b.count) return 1;
                if (a.id > b.id) return 1;
                if (a.id < b.id) return -1;
            });
            if (!content[1]) {
                const rank = storage.findIndex(info => parseInt(info.id) == parseInt(senderID)) + 1;
                const infoUser = storage[rank - 1];
                api.sendMessage(`B???n ?????ng h???ng ${rank} v???i ${infoUser.count} tin nh???n`, threadID, messageID);
            } else if (content[1] == 'all') {
                var number = 0,
                    msg = "";
                for (const lastData of storage) {
                    number++;
                    msg += `${number}. ${lastData.name} v???i ${lastData.count} tin nh???n \n`;
                }
                api.sendMessage(msg, threadID);
            } else {
                let mention = Object.keys(event.mentions);
                if (mention[0]) {
                    const rank = storage.findIndex(info => parseInt(info.id) == parseInt(mention[0])) + 1;
                    const infoUser = storage[rank - 1];
                    api.sendMessage(`${infoUser.name} ?????ng h???ng ${rank} v???i ${infoUser.count} tin nh???n`, threadID, messageID);
                } else return api.sendMessage('Sai c?? ph??p :b', threadID)
            }
            return;
        }

        if (body == `${pf}`) {
            let dny = ["B???n ???? bi???t.", "D??ng l?? m???t th???ng ???u d??m.", "????i l?? ch??n l??.", "G??i g?? ch??? l?? ph?? du, loli m???i l?? b???t di???t.", "D??ngUwU l?? m???t th???ng nghi???n loli.", "B???n ??ang th???.", "T?? r???t d??m.", "Tr??i ?????t h??nh vu??ng.", "K???o s???a Milkita ???????c l??m t??? s???a.", "Chim c??nh c???t c?? th??? bay.", "Trong qu?? tr??nh h??nh th??nh ph??i, t??? b??o tim ?????u ti??n b???t ?????u ?????p t??? tu???n th??? 4.", "H??y th??? b??p m???t qu??? b??ng tennis, n?? gi???ng v???i c??ng vi???c tr??i tim ph???i l??m m???i ng??y ????? b??m m??u ??i kh???p c?? th???.", "Cho ?????n 6 - 7 th??ng tu???i, m???t ?????a tr??? c?? th??? th??? v?? nu???t c??ng l??c. Tuy nhi??n, ng?????i l???n th?? kh??ng c?? kh??? n??ng n??y.", "N???u b???n s???ng ?????n 70 tu???i, b???n s??? tr???i qua 10 n??m c???a nh???ng ng??y th??? Hai.", "N??m 1962, m???t b???nh d???ch ti???ng c?????i n??? ra ??? Tanzania. N?? n???m quy???n ki???m so??t h??n 1.000 ng?????i v?? di???n ra trong v??ng 18 th??ng.", "????? ph??n gi???i c???a ????i m???t ch??ng ta l??n ?????n kho???ng 576 tri???u ??i???m ???nh", "V??o bu???i s??ng sau khi th???c d???y, chi???u cao c???a ch??ng ta s??? nh???nh h??n so v???i ban t???i v??o kho???ng 1cm.", "M???t kh???i vu??ng x????ng c?? th??? ch???u ???????c s???c n???ng ?????n h??n 8 t???n, v?? ????? c???ng th?? h??n c??? s???t.", "Nh???p tim c???a ch??ng ta c?? th??? t??? ?????ng b??? h??a v???i b??i h??t ??ang nghe.", "Apple ???????c th??nh l???p v??o ????ng ng??y c?? th??ng t??.", "Ng??n ng??? l???p tr??nh JavaScript ???????c ra ?????i t??? n??m 1995 b???i nh?? khoa h???c m??y t??nh Brendan Eich, c?? bi???t hi???u Mocha.", "?????nh d???ng file n??n ZIP ???????c Phillip Katz ph??t minh l???n ?????u ti??n v??o n??m 1986.", "Chi???c ??i???n tho???i k??m m??n h??nh c???m ???ng ?????u ti??n tr??n th??? gi???i ???????c ra m???t v??o n??m 1992, v???i t??n g???i IBM Simon.", "Chu???n k???t n???i Bluetooth ???????c ?????t theo t??n m???t v??? vua ng?????i ??an M???ch.", "Tin nh???n SMS ?????u ti??n ???????c g???i th??ng qua m???ng vi???n th??ng GSM Vodafrone c???a Anh v??o ng??y 3/12/1992.", "Emoticons (c??c bi???u t?????ng c???m x??c) l???n ?????u ti??n ???????c Scott Fahlman, m???t nh?? khoa h???c m??y t??nh t???i ?????i h???c Carnegie Mellon, s??? d???ng v??o ng??y 19/9/1982.", "Chu???t m??y t??nh ?????u ti??n l??m b???ng g???.", "N??m 1910, chi???c tai nghe ?????u ti??n tr??n th??? gi???i ???????c Nathaniel Baldwin ph??t minh ra trong nh?? b???p c???a m??nh ??? bang Utah (M???).", 'L???i m??y t??nh hay c??n ???????c g???i v???i c??i t??n "Bug" ???????c ?????t t??n theo ngh??a ??en c???a l???i m??y t??nh ?????u ti??n.', "Wi-Fi l?? m???t t??? kh??ng c?? ngh??a."];
            api.sendMessage('[B???n c?? bi???t?]:' + dny[Math.floor(Math.random() * dny.length)], threadID, messageID);
        }

        if (body == `${pf}loli`) {
            let name = (await api.getUserInfo(senderID))[senderID].name;
            axios.get("https://www.api-adreno.tk/loli").then(get => {
                let type = get.data.url.substring(get.data.url.lastIndexOf(".") + 1);
                var nameFile = get.data.url.slice(get.data.url.lastIndexOf("/") + 1, -4)
                let callback = function () {
                    if (type == "jpg" || type == "gif" || type == "jpg" || type == "png") {
                        type = type
                    } else type = "mp4";
                    api.sendMessage({
                        body: name + ", loli c???a b???n ????y UwU!",
                        mentions: [{
                            tag: name,
                            id: senderID
                        }],
                        attachment: fs.createReadStream(__dirname + `/media/${nameFile}.${type}`)
                    }, threadID, () => fs.unlinkSync(__dirname + `/media/${nameFile}.${type}`), messageID);
                };
                request(get.data.url).pipe(fs.createWriteStream(__dirname + `/media/${nameFile}.${type}`)).on("close", callback);
            })
        }

        if (body == `${pf}rest`) {
            if (config.admins.includes(parseInt(senderID))) {
                return api.sendMessage("Bot s??? kh???i ?????ng l???i ngay l???p t???c!", threadID, () => eval("module.exports = process.exit(1)", true), messageID);
            } else return api.sendMessage('b???n kh??ng ph???i admin bot :)', threadID, messageID);
        }


        if (body.indexOf(`${pf}box`) == 0) {
            let a = body.slice(0, 4);
            if (a.length == body.length) return api.sendMessage(`B???n c?? th??? d??ng:\n${pf}box emoji [icon]\n\n${pf}box name [t??n box c???n ?????i]\n\n${pf}box image [rep m???t ???nh b???t k?? c???n ?????t th??nh ???nh box]\n\n${pf}box admin [tag] => n?? s??? ????a qtv cho ng?????i ???????c tag\n\n${pf}box info => To??n b??? th??ng tin c???a nh??m ! 
      `, threadID, messageID);

            if (body.slice(5, 9) == "name") {
                var content = body.slice(10, body.length);
                var c = content.slice(0, 99) || event.messageReply.body;
                api.setTitle(`${c } `, threadID);
            }

            if (body.slice(5, 10) == "emoji") {
                a = body.split(" ");
                const name = a[2] || event.messageReply.body;
                api.sendMessage(a[2], threadID, () =>
                    api.changeThreadEmoji(name, threadID))
            }

            if (body.slice(5, 7) == "me") {
                if (body.slice(8, 13) == "admin") {
                    const threadInfo = await api.getThreadInfo(threadID)
                    const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
                    if (!find) api.sendMessage("BOT c???n n??m qu???n tr??? vi??n ????? d??ng ?", threadID, messageID)
                    else if (!config.admins.includes(senderID)) api.sendMessage("Quy???n h???n l???n ?", threadID, messageID)
                    else api.changeAdminStatus(threadID, senderID, true);
                }
            }

            if (body.slice(5, 10) == "admin") {
                if (body.slice(5, body.length).join().indexOf('@') !== -1) {
                    namee = Object.keys(event.mentions)
                } else return api.sendMessage('tag ai ?????', threadID, messageID);
                if (event.messageReply) {
                    namee = event.messageReply.senderID
                }

                const threadInfo = await api.getThreadInfo(threadID)
                const findd = threadInfo.adminIDs.find(el => el.id == namee);
                const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
                const finddd = threadInfo.adminIDs.find(el => el.id == senderID);

                if (!finddd) return api.sendMessage("M??y ????o ph???i qu???n tr??? vi??n box ?", threadID, messageID);
                if (!find) {
                    api.sendMessage("Kh??ng n??m qu???n tr??? vi??n d??ng con c???c ?", threadID, messageID)
                }
                if (!findd) {
                    api.changeAdminStatus(threadID, namee, true);
                } else api.changeAdminStatus(threadID, namee, false)
            }

            if (body.slice(5, 10) == "image") {
                if (event.type !== "message_reply") return api.sendMessage("??? B???n ph???i reply m???t audio, video, ???nh n??o ????", threadID, messageID);
                if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("??? B???n ph???i reply m???t audio, video, ???nh n??o ????", threadID, messageID);
                if (event.messageReply.attachments.length > 1) return api.sendMessage(`Vui l??ng reply ch??? m???t audio, video, ???nh!`, threadID, messageID);
                var callback = () => api.changeGroupImage(fs.createReadStream(__dirname + "/src/boximg.png"), threadID, () => fs.unlinkSync(__dirname + "/src/boximg.png"));
                return request(encodeURI(event.messageReply.attachments[0].url)).pipe(fs.createWriteStream(__dirname + '/src/boximg.png')).on('close', () => callback());
            };
            if (body.slice(5, 9) == "info") {
                var threadInfo = await api.getThreadInfo(threadID);
                let threadMem = threadInfo.participantIDs.length;
                var gendernam = [];
                var gendernu = [];
                var nope = [];
                for (let z in threadInfo.userInfo) {
                    var gioitinhone = threadInfo.userInfo[z].gender;
                    var nName = threadInfo.userInfo[z].name;

                    if (gioitinhone == 'MALE') {
                        gendernam.push(z + gioitinhone);
                    } else if (gioitinhone == 'FEMALE') {
                        gendernu.push(gioitinhone);
                    } else {
                        nope.push(nName);
                    }
                }
                var nam = gendernam.length;
                var nu = gendernu.length;
                let qtv = threadInfo.adminIDs.length;
                let sl = threadInfo.messageCount;
                let icon = threadInfo.emoji;
                let threadName = threadInfo.threadName;
                let id = threadInfo.threadID;
                var listad = '';
                var qtv2 = threadInfo.adminIDs;
                for (let i = 0; i < qtv2.length; i++) {
                    const infu = (await api.getUserInfo(qtv2[i].id));
                    const name = infu[qtv2[i].id].name;
                    listad += '???' + name + '\n';
                }
                let sex = threadInfo.approvalMode;
                var pd = sex == false ? 't???t' : sex == true ? 'b???t' : 'Kh';
                var pdd = sex == false ? '???' : sex == true ? '???' : '???';
                var callback = () =>
                    api.sendMessage({
                            body: `T??n box: ${threadName}\nID Box: ${id}\n${pdd} Ph?? duy???t: ${pd}\nEmoji: ${icon}\n-Th??ng tin:\nT???ng ${threadMem} th??nh vi??n\n???????????Nam: ${nam} th??nh vi??n \n???????????N???: ${nu} th??nh vi??n\n\n????????????????V???i ${qtv} qu???n tr??? vi??n g???m:\n${listad}\nT???ng s??? tin nh???n: ${sl} tin.`,
                            attachment: fs.createReadStream(__dirname + '/src/1.png')
                        },
                        threadID,
                        () => fs.unlinkSync(__dirname + '/src/1.png'),
                        messageID
                    );
                return request(encodeURI(`${threadInfo.imageSrc}`))
                    .pipe(fs.createWriteStream(__dirname + '/src/1.png'))
                    .on('close', () => callback());
            }
        }
        if (body.indexOf(`${pf}speedtest`) == 0) {
            try {
                const fast = require("fast-speedtest-api");
                const speedTest = new fast({
                    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
                    verbose: false,
                    timeout: 10000,
                    https: true,
                    urlCount: 5,
                    bufferSize: 8,
                    unit: fast.UNITS.Mbps
                });
                const resault = await speedTest.getSpeed();
                return api.sendMessage(
                    "=== Result ===" +
                    "\n- Speed: " + Math.floor(resault) + " Mbps",
                    threadID, messageID
                );
            } catch {
                return api.sendMessage("Kh??ng th??? speedtest ngay l??c n??y, h??y th??? l???i sau!", threadID, messageID);
            }
        }

        if (body.indexOf(`${pf}ghep`) == 0) {
            Economy.getMoney(senderID).then(async (money) => {
                if (money < 500) return api.sendMessage("B???n c???n 500 ????!", threadID, messageID);
                else {
                    var tle = Math.floor(Math.random() * 101);
                    var userData = (await api.getUserInfo(senderID))[senderID];
                    var name = userData.name || "B???n";
                    let threadInfo = await api.getThreadInfo(threadID);
                    var all = threadInfo.participantIDs.filter(ID => ID != senderID);;
                    var id = all[Math.floor(Math.random() * all.length)];
                    var userDataRandom = (await api.getUserInfo(id))[id];
                    var namee = userDataRandom.name || "Ng?????i ???y";
                    var arraytag = [];
                    arraytag.push({
                        id: senderID,
                        tag: name
                    });
                    arraytag.push({
                        id: id,
                        tag: namee
                    })

                    let Avatar = (await axios.get(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, {
                        responseType: "arraybuffer"
                    })).data;
                    fs.writeFileSync(__dirname + "/media/avt.png", Buffer.from(Avatar, "utf-8"));
                    let Avatar2 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, {
                        responseType: "arraybuffer"
                    })).data;
                    fs.writeFileSync(__dirname + "/media/avt2.png", Buffer.from(Avatar2, "utf-8"));
                    var imglove = [];
                    imglove.push(fs.createReadStream(__dirname + "/media/avt.png"));
                    imglove.push(fs.createReadStream(__dirname + "/media/avt2.png"));
                    var msg = {
                        body: `????Gh??p ????i th??nh c??ng!\n????T??? l??? h???p ????i: ${tle}%\n${name} ???? ${namee}`,
                        mentions: arraytag,
                        attachment: imglove
                    }
                    Economy.subtractMoney(senderID, 500);
                    return api.sendMessage(msg, threadID, messageID)
                }
            });
        }
    }
}