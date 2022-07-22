let img = document.querySelectorAll('.myImg')


img.forEach((element, index) => {
    element.addEventListener('click', ()=> {
        element.classList.toggle('displayBig')
    })
});


const fadeOut = document.querySelector('.fadeOut');
const options = {
    threshold: 0,
    rootMargin: '0px 0px 0px 0px'
}

const headingPage = new IntersectionObserver ((entrie, headingPage) => {
    entrie.forEach( entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('fadeIn')
            headingPage.unobserve(entry.target);
        }
    } )
}, options)
headingPage.observe(fadeOut);