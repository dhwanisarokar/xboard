function getID() {
  let id = Math.random().toString(36);
  id = id.substring(2);
  return id;
}

function getAccodianItems(id, title, idx) {
  return `
        <div class="accordion-item border-0 mb-4" id="card-${id}">
            <h2 class="accordion-header" id="heading-${id}">
                <button 
                    class="btn btn-link accordion-arrow" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse-${id}" 
                    aria-expanded="false" 
                    aria-controls="collapse-${id}"
                >
                    ${title}
                </button>
            </h2>
            <div id="collapse-${id}" class="accordion-collapse collapse" aria-labelledby="headingOne"  data-bs-parent="#accordionId">
            </div>
        </div>
    `;
}

function getCarouselOuter (id, innerId) {
    return `
        <div id="carouselIndicators-${id}" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner" id="${innerId}"></div>
            <button class="carousel-control-prev-btn" type="button" data-bs-target="#carouselIndicators-${id}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next-btn" type="button" data-bs-target="#carouselIndicators-${id}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;
}

function getCarouselItem (id, active, card) {
    return `<div id="${id}" class="carousel-item ${active ? "active" : ""}">${card}</div>`;
}

function getCard (item) {
    let pubDate = item.pubDate.substring(0, 10).split("-").join("/");
    return `
        <div class="card d-block">
            <img src="${item.enclosure.link}" class="card-img-top img-fluid carousel-img" alt="${item.author}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${item.author} ● 
                    <small class="card-subtitle">
                        ${pubDate}
                    </small>
                </h6>
                <p class="card-text">${item.description}</p>
                <a href="${item.link}" class="stretched-link" target="_blank"></a>
            </div>
        </div>
    `;
}

function addFeedsToDOM() {
    
    magazines.forEach(async (url, idx) => {
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURI(url)}`);
    
            const data = await res.json();
            // console.log(data.items[0]);
            
            // add accordionItem to DOM
            const accordionItemId = getID();
            const accordionItem = getAccodianItems(accordionItemId, data.feed.title, idx);
            document.getElementById("accordionId").innerHTML += accordionItem;

            if(idx === 0) {
                document.getElementById(`collapse-${accordionItemId}`).classList.add("show");
                document.querySelector(`#heading-${accordionItemId} > button`).setAttribute("aria-expanded", "true")
            }

            // append carousel to accordionItem 
            const carouselId = getID();
            const carouselInnerId = getID();
            const carousel = getCarouselOuter(carouselId, carouselInnerId);
            document.getElementById(`collapse-${accordionItemId}`).innerHTML = carousel;

            data.items.forEach((item, idx) => {
                const card = getCard(item);
                const carouselItemId = getID();
                // append card to carouselItem
                const carouselItem = getCarouselItem(carouselItemId, idx === 0, card);
                document.getElementById(carouselInnerId).innerHTML += carouselItem;
            });


        } catch (err) {
            console.error(err);
        }

    });
}

addFeedsToDOM();