/* =========================================================
   STORY SETUP
   ========================================================= */
const chapters = [...document.querySelectorAll('.chapter')];


const number = document.querySelector('#chapterNumber');
const navTitle = document.querySelector('#navTitle');

const previous = document.querySelector('#previousChapter');
const next = document.querySelector('#nextChapter');

const names = [
    'Cinematic intro',
    'Little moments',
    'Do you remember?',
    'A letter for you',
    'Final surprise'
];

let active = 1;

let chapterTimer = null;
let galleryTimer = null;
let gameTimer = null;
let letterTimer = null;
let typingTimer = null;
let backdropTimer = null;

let galleryIndex = 0;
let memoryIndex = 0;
let memoryAnswered = false;


/* =========================================================
   HELPERS
   ========================================================= */

function wait(callback, delay) {
    return window.setTimeout(callback, delay);
}


function clearTimers() {

    clearTimeout(chapterTimer);
    clearTimeout(galleryTimer);
    clearTimeout(gameTimer);
    clearTimeout(letterTimer);

    clearInterval(typingTimer);
    clearInterval(backdropTimer);

    chapterTimer = null;
    galleryTimer = null;
    gameTimer = null;
    letterTimer = null;
    typingTimer = null;
    backdropTimer = null;
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function updateNavigation() {

    if (number) {
        number.textContent = String(active).padStart(2, '0');
    }

    if (navTitle) {
        navTitle.textContent = names[active - 1];
    }

    /*
       Navigation buttons are optional.
       Your current HTML does not contain them,
       so JavaScript must not crash if they are absent.
    */

    if (previous) {
        previous.disabled = active === 1;
    }

    if (next) {
        next.disabled = active === 5 || active === 3;
    }
}


function setChapter(target) {

    const chapter = Math.max(1, Math.min(5, target));

    if (chapter === active) {
        return;
    }

    clearTimers();

    chapters.forEach((item) => {

        item.classList.toggle(
            'is-active',
            Number(item.dataset.chapter) === chapter
        );

    });

    active = chapter;

    updateNavigation();

    startChapter(chapter);
}


function startChapter(chapter) {

    /* =========================
       CHAPTER 1
    ========================== */

    if (chapter === 1) {

        restartIntro();

        /*
           Chapter 1 animation is around 13 seconds.
           Then automatically move to Chapter 2.
        */

        chapterTimer = wait(() => {

            setChapter(2);

        }, 13000);

        return;
    }


    /* =========================
       CHAPTER 2
    ========================== */

    if (chapter === 2) {

        startGallery();

        return;
    }


    /* =========================
       CHAPTER 3
    ========================== */

    if (chapter === 3) {

        renderMemory(memoryIndex);

        return;
    }


    /* =========================
       CHAPTER 4
    ========================== */

    if (chapter === 4) {

        startBackdrops();

        return;
    }


    /* =========================
       CHAPTER 5
    ========================== */

    if (chapter === 5) {

        startFinal();

        return;
    }
}


/* =========================================================
   OPTIONAL NAVIGATION BUTTONS
   ========================================================= */

if (previous) {

    previous.addEventListener('click', () => {

        if (active > 1) {
            setChapter(active - 1);
        }

    });

}


if (next) {

    next.addEventListener('click', () => {

        if (active < 5 && active !== 3) {
            setChapter(active + 1);
        }

    });

}


/* =========================================================
   KEYBOARD NAVIGATION
   ========================================================= */

document.addEventListener('keydown', (event) => {

    if (
        event.target.matches &&
        event.target.matches('input, textarea, button')
    ) {
        return;
    }

    if (event.key === 'ArrowRight') {

        if (active !== 3 && active < 5) {
            setChapter(active + 1);
        }

    }


    if (event.key === 'ArrowLeft') {

        if (active > 1) {
            setChapter(active - 1);
        }

    }

});


/* =========================================================
   CHAPTER 1 — CINEMATIC INTRO
   ========================================================= */

function restartIntro() {

    const intro = document.querySelector('.chapter--intro');

    if (!intro) {
        return;
    }

    /*
       Restart CSS animations cleanly every time
       Chapter 1 opens again.
    */

    const animatedElements = intro.querySelectorAll(
        '.intro-chapter, ' +
        '.intro-line, ' +
        '.intro-birth, ' +
        '.intro-photo-wrap, ' +
        '.intro-final'
    );


    animatedElements.forEach((element) => {

        element.style.animation = 'none';

    });


    const photo = intro.querySelector(
        '.intro-photo-frame img'
    );


    if (photo) {

        photo.style.animation = 'none';

    }


    void intro.offsetWidth;


    animatedElements.forEach((element) => {

        element.style.animation = '';

    });


    if (photo) {

        photo.style.animation = '';

    }


    animateIntroAge();
}


/* =========================================================
   CHAPTER 1 — AGE COUNTER
   ========================================================= */

function animateIntroAge() {

    const ageNumber = document.querySelector('#ageNumber');

    if (!ageNumber) {
        return;
    }

    ageNumber.textContent = '0';


    /*
       Age counter starts after the birth-date section
       appears on screen.
    */

    window.setTimeout(() => {

        const start = performance.now();

        const duration = 1400;


        function updateAge(now) {

            const progress = Math.min(
                (now - start) / duration,
                1
            );


            /*
               Smooth ease-out animation.
            */

            const eased =
                1 - Math.pow(1 - progress, 3);


            const age =
                Math.floor(eased * 17);


            ageNumber.textContent =
                String(age);


            if (progress < 1) {

                requestAnimationFrame(updateAge);

            } else {

                ageNumber.textContent = '17';

            }

        }


        requestAnimationFrame(updateAge);

    }, 7000);
}


/* =========================================================
   CHAPTER 2 — MEMORY GALLERY
   ========================================================= */

const slides = [
    ...document.querySelectorAll('.gallery-slide')
];


const galleryCount =
    document.querySelector('#galleryCount');


const galleryProgress =
    document.querySelector('#galleryProgress');


const galleryCaption =
    document.querySelector('#galleryCaption');


const galleryBackdrop =
    document.querySelector('#galleryBackdrop');


const galleryCaptions = [

    'And the story began...',

    'Little moments became beautiful memories.',

    'Growing up, one smile at a time.',

    'Some memories never grow old.',

    'And look at you now...',

    'Still the same beautiful soul. ❤️'

];


function showGallery(index) {

    if (!slides.length) {
        return;
    }


    if (index < 0) {
        index = 0;
    }


    if (index >= slides.length) {
        index = slides.length - 1;
    }


    galleryIndex = index;


    slides.forEach((slide) => {

        slide.classList.remove(
            'is-current',
            'is-animating'
        );

    });


    const stage =
        document.querySelector('.gallery-stage');


    if (stage) {
        void stage.offsetWidth;
    }


    const current = slides[index];


    if (!current) {
        return;
    }


    current.classList.add(
        'is-current',
        'is-animating'
    );


    if (galleryCount) {

        galleryCount.textContent =
            String(index + 1).padStart(2, '0');

    }


    if (galleryCaption) {

        galleryCaption.textContent =
            galleryCaptions[index] || '';

    }


    /*
       Background image is optional.
       If CSS uses galleryBackdrop,
       it will receive the current image.
    */

    if (galleryBackdrop) {

        const image =
            current.querySelector('img');


        if (image) {

            const source =
                image.getAttribute('src');


            if (source) {

                galleryBackdrop.style.setProperty(
                    '--gallery-image',
                    `url('${source}')`
                );

            }

        }

    }


    if (galleryProgress) {

        galleryProgress.classList.remove(
            'is-running'
        );


        void galleryProgress.offsetWidth;


        galleryProgress.classList.add(
            'is-running'
        );

    }


    updateGalleryThumbnails(index);
}


/* =========================================================
   GALLERY THUMBNAILS
   ========================================================= */

function updateGalleryThumbnails(index) {

    const thumbnails =
        document.querySelectorAll(
            '.gallery-thumbnails span'
        );


    thumbnails.forEach((thumbnail, i) => {

        thumbnail.classList.toggle(
            'is-active',
            i === index
        );

    });

}


/* =========================================================
   START GALLERY
   ========================================================= */

function startGallery() {

    if (!slides.length) {
        return;
    }


    galleryIndex = 0;


    showGallery(galleryIndex);


    galleryTimer = wait(
        advanceGallery,
        4000
    );
}


/* =========================================================
   ADVANCE GALLERY
   ========================================================= */

function advanceGallery() {

    if (active !== 2) {
        return;
    }


    /*
       After the last photo,
       automatically go to Chapter 3.
    */

    if (galleryIndex >= slides.length - 1) {

        galleryIndex = 0;

        setChapter(3);

        return;
    }


    galleryIndex += 1;


    showGallery(galleryIndex);


    galleryTimer = wait(
        advanceGallery,
        4000
    );
}


/* =========================================================
   CHAPTER 3 — CHILDHOOD MEMORY GAME
   ========================================================= */

const memories = [

    {
        image: 'renuchildhood1.jpeg',

        question:
            'Which memory feels the oldest?',

        options: [
            'A tiny adventure',
            'A first little smile',
            'A day full of wonder',
            'A beautiful beginning'
        ]
    },

    {
        image: 'renuchildhood2.jpeg',

        question:
            'What does this moment feel like?',

        options: [
            'Pure joy',
            'A quiet dream',
            'A little mischief',
            'A warm hug'
        ]
    },

    {
        image: 'renuchildhood3.jpeg',

        question:
            'Choose a word for this smile.',

        options: [
            'Sunshine',
            'Magic',
            'Brave',
            'Lovely'
        ]
    },

    {
        image: 'renuchildhood4.jpeg',

        question:
            'What would you keep from this memory?',

        options: [
            'The laughter',
            'The sparkle',
            'The feeling',
            'Every little bit'
        ]
    }

];


const memoryGame =
    document.querySelector('#memoryGame');


const memoryComplete =
    document.querySelector('#memoryComplete');


const memoryCount =
    document.querySelector('#memoryCount');


const memoryImage =
    document.querySelector('#memoryImage');


const memoryBlur =
    document.querySelector('#memoryBlur');


const memoryQuestion =
    document.querySelector('#memoryQuestion');


const memoryOptions =
    document.querySelector('#memoryOptions');


const memoryFeedback =
    document.querySelector('#memoryFeedback');


/* =========================================================
   RENDER MEMORY
   ========================================================= */

function renderMemory(index) {

    if (!memories[index]) {
        return;
    }


    const memory =
        memories[index];


    memoryAnswered = false;


    if (memoryGame) {

        memoryGame.hidden = false;

    }


    if (memoryComplete) {

        memoryComplete.hidden = true;

    }


    if (memoryCount) {

        memoryCount.textContent =
            `Memory ${index + 1} / ${memories.length}`;

    }


    if (memoryImage) {

        memoryImage.src =
            memory.image;


        const animations = [
            'kb-in',
            'kb-out',
            'kb-right',
            'kb-left'
        ];


        memoryImage.className =
            `kenburns ${animations[index]}`;

    }


    /*
       memoryBlur is optional in your current HTML.
       Only use it when it exists.
    */

    if (memoryBlur) {

        memoryBlur.style.setProperty(
            '--image',
            `url('${memory.image}')`
        );

    }


    if (memoryQuestion) {

        memoryQuestion.textContent =
            memory.question;

    }


    if (memoryFeedback) {

        memoryFeedback.textContent = '';

        memoryFeedback.className =
            'memory-feedback';

    }


    if (!memoryOptions) {
        return;
    }


    memoryOptions.replaceChildren();


    memory.options.forEach((option) => {

        const button =
            document.createElement('button');


        button.type = 'button';


        button.className =
            'memory-option';


        button.textContent =
            option;


        button.addEventListener(
            'click',
            () => answerMemory(button)
        );


        memoryOptions.appendChild(button);

    });

}


/* =========================================================
   ANSWER MEMORY
   ========================================================= */

function answerMemory(selected) {

    if (memoryAnswered) {
        return;
    }


    if (!memoryOptions) {
        return;
    }


    memoryAnswered = true;


    const buttons = [
        ...memoryOptions.children
    ];


    buttons.forEach((button) => {

        button.disabled = true;

    });


    selected.classList.add(
        'is-correct'
    );


    if (memoryFeedback) {

        memoryFeedback.textContent =
            'That feels just right. ♥';


        memoryFeedback.classList.add(
            'is-correct'
        );

    }


    gameTimer = wait(() => {

        if (
            memoryIndex <
            memories.length - 1
        ) {

            memoryIndex += 1;

            renderMemory(memoryIndex);

        } else {

            if (memoryGame) {

                memoryGame.hidden = true;

            }


            if (memoryComplete) {

                memoryComplete.hidden = false;

            }


            gameTimer = wait(() => {

                setChapter(4);

            }, 2000);

        }

    }, 1500);

}


/* =========================================================
   CHAPTER 4 — LETTER
   ========================================================= */

const message = `Dear cutie pie 🥰,

Some people become a beautiful part of our lives without even trying.

You are one of those people.

From those little childhood memories to all the moments we have today, every chapter has something special about you.

I hope this new year of your life brings you happiness, success, peace, and countless reasons to smile.

Never stop being the wonderful person you are.

Keep smiling.
Keep shining.
Keep creating beautiful memories.

Happy Birthday, gangster 😎. ♥`;


const openLetter =
    document.querySelector('#openLetter');


const paper =
    document.querySelector('#letterPaper');


const letterText =
    document.querySelector('#letterText');


/* =========================================================
   TYPE LETTER
   ========================================================= */

function typeLetter() {

    clearInterval(typingTimer);


    if (!letterText) {
        return;
    }


    letterText.textContent = '';


    let i = 0;


    typingTimer = setInterval(() => {

        letterText.textContent +=
            message[i] || '';


        i += 1;


        if (i >= message.length) {

            clearInterval(typingTimer);

            typingTimer = null;


            /*
               Wait after the letter is completely typed,
               then automatically continue to Chapter 5.
            */

            letterTimer = wait(() => {

                setChapter(5);

            }, 4500);

        }

    }, 14);

}


/* =========================================================
   OPEN LETTER
   ========================================================= */

if (openLetter) {

    openLetter.addEventListener(
        'click',
        () => {

            if (
                openLetter.classList.contains(
                    'is-open'
                )
            ) {
                return;
            }


            openLetter.classList.add(
                'is-open'
            );


            openLetter.setAttribute(
                'aria-expanded',
                'true'
            );


            wait(() => {

                if (paper) {

                    paper.classList.add(
                        'is-visible'
                    );

                }


                openLetter.classList.add(
                    'is-hidden'
                );


                typeLetter();

            }, 650);

        }
    );

}


/* =========================================================
   CHAPTER 4 — BACKGROUND PHOTOS
   ========================================================= */

const backdrops = [
    ...document.querySelectorAll(
        '.letter-backdrops img'
    )
];


function startBackdrops() {

    clearInterval(backdropTimer);


    if (backdrops.length < 2) {
        return;
    }


    let index = 0;


    backdrops.forEach((image, i) => {

        image.classList.toggle(
            'is-visible',
            i === 0
        );

    });


    backdropTimer = setInterval(() => {

        if (active !== 4) {
            return;
        }


        backdrops[index].classList.remove(
            'is-visible'
        );


        index =
            (index + 1) %
            backdrops.length;


        backdrops[index].classList.add(
            'is-visible'
        );


    }, 5000);

}


/* =========================================================
   CHAPTER 5 — FINAL SURPRISE
   ========================================================= */

const finalPreamble =
    document.querySelector(
        '.final-preamble'
    );


const finalReveal =
    document.querySelector(
        '.final-reveal'
    );


const revealSurprise =
    document.querySelector(
        '#revealSurprise'
    );


const replayJourney =
    document.querySelector(
        '#replayJourney'
    );


const celebration =
    document.querySelector(
        '#celebration'
    );


/* =========================================================
   START FINAL
   ========================================================= */

function startFinal() {

    if (finalPreamble) {

        finalPreamble.style.opacity =
            '1';


        finalPreamble.style.pointerEvents =
            'auto';

    }


    if (finalReveal) {

        finalReveal.classList.remove(
            'is-visible'
        );

    }


    if (celebration) {

        celebration.replaceChildren();

        celebration.setAttribute(
            'aria-hidden',
            'true'
        );

    }

}


/* =========================================================
   CELEBRATION EFFECT
   ========================================================= */

function celebrate() {

    if (!celebration) {
        return;
    }


    celebration.replaceChildren();


    const symbols = [
        '♥',
        '✦',
        '♥',
        '✧'
    ];


    const colors = [
        '#f6b5bd',
        '#eacb91',
        '#ffffff',
        '#d4b6ef'
    ];


    for (
        let i = 0;
        i < 100;
        i += 1
    ) {

        const item =
            document.createElement('span');


        item.textContent =
            symbols[
                i % symbols.length
            ];


        item.style.left =
            `${Math.random() * 100}%`;


        item.style.setProperty(
            '--size',
            `${0.65 + Math.random() * 1.3}rem`
        );


        item.style.setProperty(
            '--color',
            colors[
                i % colors.length
            ]
        );


        item.style.setProperty(
            '--time',
            `${3 + Math.random() * 3}s`
        );


        item.style.setProperty(
            '--drift',
            `${-13 + Math.random() * 26}vw`
        );


        celebration.appendChild(item);

    }


    celebration.setAttribute(
        'aria-hidden',
        'false'
    );

}


/* =========================================================
   REVEAL SURPRISE
   ========================================================= */

if (revealSurprise) {

    revealSurprise.addEventListener(
        'click',
        () => {

            if (finalPreamble) {

                finalPreamble.style.opacity =
                    '0';


                finalPreamble.style.pointerEvents =
                    'none';

            }


            if (finalReveal) {

                finalReveal.classList.add(
                    'is-visible'
                );

            }


            celebrate();

        }
    );

}


/* =========================================================
   REPLAY JOURNEY
   ========================================================= */

if (replayJourney) {

    replayJourney.addEventListener(
        'click',
        () => {

            clearTimers();


            galleryIndex = 0;

            memoryIndex = 0;

            memoryAnswered = false;


            if (finalReveal) {

                finalReveal.classList.remove(
                    'is-visible'
                );

            }


            if (finalPreamble) {

                finalPreamble.style.opacity =
                    '1';


                finalPreamble.style.pointerEvents =
                    'auto';

            }


            if (celebration) {

                celebration.replaceChildren();

                celebration.setAttribute(
                    'aria-hidden',
                    'true'
                );

            }


            if (openLetter) {

                openLetter.classList.remove(
                    'is-open',
                    'is-hidden'
                );


                openLetter.setAttribute(
                    'aria-expanded',
                    'false'
                );

            }


            if (paper) {

                paper.classList.remove(
                    'is-visible'
                );

            }


            if (letterText) {

                letterText.textContent = '';

            }


            chapters.forEach((chapter) => {

                chapter.classList.toggle(
                    'is-active',
                    Number(
                        chapter.dataset.chapter
                    ) === 1
                );

            });


            active = 1;


            updateNavigation();


            restartIntro();


            /*
               Same 13-second Chapter 1 timing
               after replay.
            */

            chapterTimer = wait(() => {

                setChapter(2);

            }, 13000);

        }
    );

}


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

chapters.forEach((chapter) => {

    chapter.classList.toggle(
        'is-active',
        Number(
            chapter.dataset.chapter
        ) === 1
    );

});


active = 1;


updateNavigation();


restartIntro();


/*
   IMPORTANT:
   Chapter 1 → Chapter 2 automatically.
*/

chapterTimer = wait(() => {

    setChapter(2);

}, 13000);
const birthdayMusic = document.querySelector('#birthdayMusic');

document.addEventListener('click', () => {
    if (birthdayMusic) {
        birthdayMusic.play().catch(error => {
            console.log('Music error:', error);
        });
    }
}, { once: true });