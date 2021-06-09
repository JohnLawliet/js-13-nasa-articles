const resultsNav = document.getElementById('resultsNav')
const favouritesNav = document.getElementById('favouritesNav')
const imagesContainer = document.querySelector(".images-container")
const saveConfirmed = document.querySelector(".save-confirmed")
const loader = document.querySelector(".loader")

// NASA API 
const count = 6
const apiKey = '3Kl3JNAdqJzwqguNFSRMEKf4UnHZpicEJYUqPAg1'
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favourites = {}
let isLoading = false

const showContent = (page) => {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    })
    if(page==="results"){
        resultsNav.classList.remove('hidden')
        favouritesNav.classList.add('hidden')        
    }  
    else if (page==="favourites"){
        resultsNav.classList.add('hidden')
        favouritesNav.classList.remove('hidden')  
    }
    // Hide loader
    loader.classList.add('hidden')
}


const createNode = (page) => {
    showContent(page)
    const currentArray = (page==="results") ? resultsArray : Object.values(favourites)
    currentArray.forEach(result => {
        const card = document.createElement('div')
        card.classList.add('card')
        const link = document.createElement('a')
        link.href = result.hdurl
        link.title = 'View Full Image'
        link.target = '_blank'
        // Image
        const image = document.createElement('img')
        image.src = result.url;
        image.alt = "NASA picture of the day"
        image.loading = 'lazy'
        image.classList.add('card-img-top')
        // Card body
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        // Card title
        const cardTitle = document.createElement('h5')
        cardTitle.classList.add('card-title')
        cardTitle.textContent = result.title
        // Save text
        const saveText = document.createElement('p')
        saveText.classList.add('clickable')
        if (page==="results"){
            saveText.textContent = "Add to Favourites"
            saveText.setAttribute('onclick',`saveFavourite('${result.url}')`)   
        }
        else{
            saveText.textContent = "Remove Favourite"
            saveText.setAttribute('onclick',`removeFavourite('${result.url}')`)   
        }

        // Card text
        const cardText = document.createElement('p')
        cardText.classList.add('card-text')
        cardText.textContent = result.explanation
        // Footer
        const footer = document.createElement('small')
        footer.classList.add('text-muted')
        // Date
        const date = document.createElement("strong")
        date.textContent = result.date
        // Copyright
        const copyright = document.createElement('span')
        result.copyright ? copyright.textContent = `  ©${result.copyright}` : null
        
        // Append
        footer.append(date, copyright)
        cardBody.append(cardTitle, saveText, cardText, footer)
        link.appendChild(image)
        card.append(link, cardBody)
        imagesContainer.appendChild(card)
    })
}

const updateDOM = (page) => {             
    // get favourites if available
    if (localStorage.getItem('nasaFavourites')){
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'))
    }   
    imagesContainer.textContent = ''
    createNode(page)
}

// Get 10 images from NASA APi
const getNasaPictures = async (page) => {
    // Show loader
    loader.classList.remove('hidden')
    try{
        const response = await fetch(apiURL)
        const results = await response.json()
        resultsArray = results
        updateDOM(page)
    }
    catch(error){
        console.log("error : ",error)
    }
}

// remove fav
const removeFavourite = (itemUrl) => {
    delete favourites[itemUrl]
    // update local stroage
    localStorage.setItem('nasaFavourites',JSON.stringify(favourites))
    updateDOM('favourites')
}


// Add result to favourites
const saveFavourite = (itemUrl) => {
    // Loop throught results array to save fav
    resultsArray.forEach(item => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl])
        {
            favourites[itemUrl] = item
            // Show save confirmation for 2 seconds
            saveConfirmed.classList.toggle('hidden')
            setTimeout(() => {
                saveConfirmed.classList.toggle('hidden')
            }, 1000)
            // Save to local stroage
            localStorage.setItem('nasaFavourites',JSON.stringify(favourites))
        }
    })
}



// OnLoad
getNasaPictures('results')