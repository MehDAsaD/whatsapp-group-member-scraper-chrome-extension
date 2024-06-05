chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
	if (data.msg === 'do-scraping') {
		DoScrape()
	}
});

async function DoScrape(){
	//create a notifer element
	let notifer_el = document.createElement("div");
	notifer_el.style.zIndex = 999;
	notifer_el.style.backgroundColor = "#006e2b";
	notifer_el.style.color = "#ffffff";
	notifer_el.style.position = "absolute";
	notifer_el.style.left = "15px";
	notifer_el.style.top = "15px";
	notifer_el.style.width = "300px";
	notifer_el.style.fontSize = "14px";
	notifer_el.style.padding = "7px 10px 8px 10px";
	notifer_el.style.border = "3px solid #ffd000";
	notifer_el.style.borderRadius = "6px";
	notifer_el.style.lineHeight = "20px";
	notifer_el.style.boxShadow = "0 0 9px #3f3f3f42";
	notifer_el.innerHTML = "WhatsApp Group Member Scraper (by v-User) </br> Scraping process started...";
	console.log("Scraping process started...");
	document.body.insertBefore(notifer_el, document.body.firstChild);

	let all_members_info = "", index=0;
	let doWhile = true;
	let black_list='', userTelNumber = '';
	let yCoordinates = 1008;
	let eachRow = document.querySelectorAll("[role=dialog] [role=listitem] [role=button]");
	let scrollBar = document.querySelector('div[data-animate-modal-popup="true"] > div > div > div > div:nth-child(3)');
	if (eachRow.length > 1) {

		try {
			while (doWhile){
				let userCounter=0;
				for (let i=0; i<eachRow.length; i++){
					let telTag = eachRow[i].querySelector("[role=gridcell] > span:first-child span");
					if (!telTag){
						userTelNumber = "No Number";
					}else {
						userTelNumber = telTag.innerHTML;
						userTelNumber = userTelNumber.replace(/\s/g, "");
					}

					let name = eachRow[i].querySelector(" [role=gridcell] > div > div > span[title][aria-label]");
					let  userName= name ? name.getAttribute('title') : 'No Name';

					let userBio = eachRow[i].querySelector("div > div:nth-child(2) >  div:nth-child(2) > div > span[title][aria-label]");
					let userBioText = userBio ? userBio.getAttribute('title') : 'No Bio';

					let current_member_info = `Name: ${userName},   Phone Number: ${userTelNumber},   Bio: ${userBioText}`;
					console.log("current_member_info :", current_member_info );

					if (!black_list.includes(current_member_info)){
						await wait(1000);
						index++;
						userCounter+=1;
						all_members_info += current_member_info + "\r\n";
						black_list = black_list + current_member_info;
						doWhile = true;
						if (index > 170){
							throw new Error('break');
						}
					}
					const member_amount_info = `Found ${index} members`;
					console.log(member_amount_info);
				}

				if (userCounter === 0){
					doWhile = false;
				}else if(userCounter > 0){
					doWhile = true;
				}

				scrollBar.scroll(0, yCoordinates);
				yCoordinates+=1008;
				await wait(500);

				eachRow = document.querySelectorAll("[role=dialog] [role=listitem] [role=button]");
			}
		}catch (e) {
			if (e.message !== 'break') throw e;
		}
		const member_amount_info = `Found ${index} members`;
		notifer_el.innerHTML = "WhatsApp Group Member Scraper (by v-User) </br> " + member_amount_info;
		console.log(member_amount_info);

		notifer_el.innerHTML = "WhatsApp Group Member Scraper (by v-User) </br> Scraping process finished.";
		console.log("Scraping process finished.");

		const closeBtn = document.querySelector("div[data-animate-modal-body=true] [role=button],[aria-label=Close]");
		await wait(1000);
		closeBtn.click();


		//get group name as export file name
		let fnE = document.querySelector("#main header div[role=button] > div > div > span");
		let fn = fnE ? fnE.textContent : "v-user-export-data.txt";
		fn = fn.replace(/[/\\?%*:|"<>]/g, '-'); //remove illegal chars from the file name

		//save as a text file
		const uri = "data:text/plain;charset=utf-8," + all_members_info;
		let ea = document.createElement("a");
		ea.href = uri;
		ea.download = fn; //group name
		document.body.appendChild(ea);
		ea.click();
		// document.body.removeChild(ea);

	} else {
		notifer_el.style.backgroundColor = "#006e2b";
		notifer_el.innerHTML = "WhatsApp Group Member Scraper (by v-User) </br> Error: Members list is not visible!";
		console.log("Error: Members list is not visible!");
	}

	await wait(2000);
	document.body.removeChild(notifer_el);
}

// ساخت فانکشن برای ایجاد مکث -----------------
function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
