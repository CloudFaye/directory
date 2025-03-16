<script lang='ts'>
	import { fade, slide } from "svelte/transition";
  import { onMount } from 'svelte';

  let hoveredIndex = -1;
  let isMobile = false;

  onMount(() => {
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  });

  function checkIfMobile() {
    isMobile = window.innerWidth < 768;
  }

  const names = ["Bankole", "Keith", "Olamide", "Linda", "Timothy", "Karen", "Damilare",
   "Vincent", "Catherine", "Nathan", "Ayodele", "Jacob", "Howard", "Isaac", "Heather", 
   "Lucy", "Paul", "Folarin", "Pamela", "Frederick", "Amanda", "Trevor", "Tunde", "Lisa", 
   "Edward", "Sylvia", "Harold", "Claire", "Richard", "Adekunle", "Gloria", "Raymond", 
   "Temitope", "Tracy", "Thomas", "Jeremy", "Florence", "Olabisi", "Jack", "Esther", 
   "Ryan", "Olufemi", "George", "Victoria", "Zachary", "Hannah", "Charles", "Brian", 
   "Rose", "Adenike", "Henry", "Sharon", "Dennis", "Irene", "Donald", 
   "Luke", "Sarah", "Yvonne", "Marcus", "Angela", "Patrick",
    "Janet", "Gbemisola", "Steven", "Diana", "Scott", "Emily", 
    "Justin", "Jennifer", "Adewale", "Victor", "Susan", "Robert",
     "Katherine", "Michael", "Ruth", "Matthew", "Abimbola", "Tina", 
     "Babatunde", "Elizabeth", "Wayne", "John", "Kenneth", "Oluwaseun",
      "Dorothy", "Walter", "Helen", "Gregory", "Caroline", "Anthony", "Rebecca", 
      "Segun", "Felix", "Jonathan", "Sophia", "Curtis", "Michelle", "Christopher",
       "Oluwadamilola", "Warren", "Nicole", "William", "Oliver", "Jessica", "Francis", 
       "Adesola", "Vanessa", "Leonard", "Joy", "Gerald", "Nancy", "Gabriel", "Ethan",
        "Margaret", "James", "Faith", "Eniola", "Louis", "Funmilayo", "Martha", "Mark", 
        "Adebola", "Teresa", "Ashley", "Stephen", "Sandra", "Bamidele", "Melissa", "Lawrence", "Rachel",
         "Nicholas", "Abiola", "Grace", "Joseph", "Andrew", "Melanie", "Joel", "Daniel", "Mary", "Jefferson",
          "Ayinde", "Wesley", "David", "Beatrice", "Vivian", "Philip", "Winston", "Kevin", "Martin", "Julian", "Xavier",
           "Emma", "Calvin", "Alex", "Jason", "Frank", "Eric", "Joshua", "Sean", "Harry", "Peter"]

  const professions = [
    'Software Engineer', 'Graphic Designer', 'Photographer', 'UI/UX Designer', 
    'Game Developer', 'Data Scientist', 'Product Manager', 'Content Creator',
    'Illustrator', '3D Artist', 'Architect', 'Music Producer', 'Writer'
  ];
  
  const hobbies = [
    'loves hiking mountains', 'collects vintage cameras', 'plays chess competitively',
    'practices yoga daily', 'brews artisanal coffee', 'restores vintage furniture',
    'builds mechanical keyboards', 'creates miniature sculptures', 'runs marathons',
    'paints watercolor landscapes', 'grows rare houseplants', 'composes electronic music',
    'designs board games', 'practices calligraphy', 'makes handcrafted pottery'
  ];
  
  const traits = [
    'is a morning person', 'thrives at night', 'is incredibly detail-oriented',
    'thinks outside the box', 'has a minimalist approach', 'is wildly creative',
    'has endless patience', 'is driven by curiosity', 'values simplicity',
    'is always experimenting', 'has a quirky sense of humor', 'is deeply thoughtful'
  ];
  
  const facts = [
    'speaks three languages', 'once lived in a treehouse', 'can solve a Rubik\'s cube in under a minute',
    'has visited 25 countries', 'makes amazing sourdough bread', 'has a collection of rare succulents',
    'built a tiny house', 'rescues stray animals', 'knows how to sail', 
    'has a photographic memory', 'plays five instruments', 'grows their own vegetables',
    'practices meditation', 'published a book', 'maintains a fascinating blog'
  ];

  const randomName = Array(600).fill(0).map((_, i) => {
    return names[Math.floor(Math.random() * names.length)]
  })
  
  const bios = Array(600).fill(0).map((_, i) => {
    const randomProf = professions[Math.floor(Math.random() * professions.length)];
    const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
    const randomTrait = traits[Math.floor(Math.random() * traits.length)];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    
    return {
      name: randomName[i],
      profession: randomProf,
      bio: `A ${randomProf.toLowerCase()} who ${randomHobby} and ${randomTrait}. ${randomFact}.`
    };
  });
  
  const shapeTypes = ['circle', 'rectangle', 'triangle', 'hexagon', 'dots', 'waves', 'lines', 'spiral'];
  
  function generateRandomShape(index: number) {
    const shapeType = shapeTypes[index % shapeTypes.length];
    const colors = ['#FFF', '#EEE', '#DDD', '#FFCCCB', '#FFDAB9', '#FFB6C1', '#FFC0CB'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    switch(shapeType) {
      case 'circle':
        const cx = 150 + Math.random() * 50 - 25;
        const cy = 175 + Math.random() * 50 - 25;
        const r = 30 + Math.random() * 70;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${randomColor}" opacity="0.7" />`;
      
      case 'rectangle':
        const x = 50 + Math.random() * 100;
        const y = 100 + Math.random() * 100;
        const width = 100 + Math.random() * 100;
        const height = 50 + Math.random() * 100;
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${randomColor}" opacity="0.7" />`;
      
      case 'triangle':
        const x1 = 150 + Math.random() * 100 - 50;
        const y1 = 100 + Math.random() * 50;
        const x2 = x1 + Math.random() * 100 - 50;
        const y2 = y1 + Math.random() * 150;
        const x3 = x1 - Math.random() * 100 + 50;
        const y3 = y1 + Math.random() * 150;
        return `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${randomColor}" opacity="0.7" />`;
      
      case 'hexagon':
        const centerX = 150;
        const centerY = 175;
        const radius = 70 + Math.random() * 30;
        let points = '';
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          points += `${x},${y} `;
        }
        return `<polygon points="${points}" fill="${randomColor}" opacity="0.7" />`;
      
      case 'dots':
        let dots = '';
        for (let i = 0; i < 15; i++) {
          const dotX = Math.random() * 300;
          const dotY = Math.random() * 350;
          const dotSize = 5 + Math.random() * 15;
          dots += `<circle cx="${dotX}" cy="${dotY}" r="${dotSize}" fill="${randomColor}" opacity="0.7" />`;
        }
        return dots;
      
      case 'waves':
        const startY = 50 + Math.random() * 150;
        const amplitude = 20 + Math.random() * 40;
        const frequency = 0.02 + Math.random() * 0.04;
        let path = `<path d="M 0 ${startY}`;
        for (let x = 10; x <= 300; x += 10) {
          const y = startY + Math.sin(x * frequency) * amplitude;
          path += ` L ${x} ${y}`;
        }
        path += `" stroke="${randomColor}" stroke-width="${5 + Math.random() * 10}" fill="none" opacity="0.7" />`;
        return path;
      
      case 'lines':
        let lines = '';
        const lineCount = 5 + Math.floor(Math.random() * 10);
        for (let i = 0; i < lineCount; i++) {
          const startX = Math.random() * 300;
          const startY = Math.random() * 350;
          const endX = Math.random() * 300;
          const endY = Math.random() * 350;
          lines += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="${randomColor}" stroke-width="${2 + Math.random() * 6}" opacity="0.7" />`;
        }
        return lines;
      
      case 'spiral':
        let spiral = `<path d="M 150 175`;
        const turns = 3 + Math.random() * 3;
        const spiralGrowth = 1 + Math.random() * 2;
        for (let angle = 0; angle < Math.PI * 2 * turns; angle += 0.1) {
          const radius = angle * spiralGrowth;
          const x = 150 + Math.cos(angle) * radius;
          const y = 175 + Math.sin(angle) * radius;
          spiral += ` L ${x} ${y}`;
        }
        spiral += `" stroke="${randomColor}" stroke-width="${2 + Math.random() * 3}" fill="none" opacity="0.7" />`;
        return spiral;
      
      default:
        return `<circle cx="150" cy="175" r="70" fill="${randomColor}" opacity="0.7" />`;
    }
  }
  
  const shapes = Array(600).fill(0).map((_, i) => generateRandomShape(i));
  
  let hoverTimeout: number | null = null;
  let isLeaving = false;
  let showListHighlight = true;
  
  function handleMouseEnter(index: number) {
    if (isMobile) return;
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    isLeaving = false;
    showListHighlight = true;
    hoveredIndex = index;
  }
  
  function handleMouseLeave() {
    if (isMobile) return;
    
    hoverTimeout = setTimeout(() => {
      isLeaving = true;
      
      setTimeout(() => {
        showListHighlight = false;
      }, 400);
      
      setTimeout(() => {
        hoveredIndex = -1;
        hoverTimeout = null;
        
        setTimeout(() => {
          isLeaving = false;
        }, 200);
      }, 1500);
    }, 1500);
  }
</script>


<main class='flex items-center justify-start h-screen'>
   <div class='middle-container overflow-y-scroll flex gap-1 flex-col px-6 max-w-full w-full md:w-[45%] border-gray-200 h-full'>
    <h1 class="text-LG font-bold">{bios.length} Creatives thriving in +234</h1>
    {#each Array(600).fill(0) as _, i}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class='list flex cursor-pointer flex-row items-center justify-between h-fit w-full' 
      class:hovered={!isMobile && hoveredIndex === i && showListHighlight}
      class:others-hovered={!isMobile && hoveredIndex !== -1 && hoveredIndex !== i && showListHighlight}
      on:mouseenter={() => handleMouseEnter(i)}
      on:mouseleave={handleMouseLeave}
    >
        <p class="font-medium">{bios[i].name}</p>
        <p class="text-gray-600">{bios[i].profession}</p>
    </div>
    {/each}
    <div class="absolute  flex-col gap-[-15px] cards-wrapper bottom-80 right-80 md:block hidden" class:leaving={isLeaving}>
         <div class="bio-container card w-[340px] py-4 h-fit  " class:active={hoveredIndex !== -1} class:leaving={isLeaving}>
      <div class="content" class:visible={hoveredIndex !== -1}>
        {#if hoveredIndex !== -1}
        <p class="text-lg font-semibold mb-2">{bios[hoveredIndex].name} [{bios[hoveredIndex].profession}] </p>
        <p class="text-sm text-gray-600">{bios[hoveredIndex].bio}</p>
        {/if}
      </div>
    </div>
  <div class="image-container card w-[340px] h-[240px] bg-red-500 " class:active={hoveredIndex !== -1} class:leaving={isLeaving}>
      {#if hoveredIndex !== -1}
        <svg width="100%" height="100%" viewBox="0 0 300 350">
          {@html shapes[hoveredIndex]}
        </svg>
      {/if}
    </div>
   
     <div class="portfolio-container card w-[340px] p-4 h-fit bg-gray-100 " class:active={hoveredIndex !== -1} class:leaving={isLeaving}>
      <div class="content" class:visible={hoveredIndex !== -1}>
        {#if hoveredIndex !== -1}
        <p class="text-lg font-semibold text-gray-600">portfolio.com</p>
        {/if}
      </div>
    </div>
    </div>
  
   </div>
</main>

<style lang="postcss">
    .content {
        opacity: 0;
        transition: opacity 0.3s ease-out;
    }

    .content.visible {
        opacity: 1;
    }

    .cards-wrapper {
        display: flex;
        flex-direction: column;
    }

    .card {
        transition-property: transform, margin, opacity;
        transition-duration: 0.5s;
        transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        opacity: 0;
        pointer-events: none;
        transform: translateY(0) scale(0.95);
        will-change: transform, opacity, margin;
    }

    .card:not(.active) {
        opacity: 0;
        transition-property: opacity, transform, margin;
        transition-duration: 0.5s, 0.4s, 0.5s;
    }

    .card.active {
        opacity: 1;
        transition-property: opacity, transform, margin;
        transition-duration: 0.5s, 0.9s, 1.1s;
    }

    .bio-container.active {
        transform: scale(1);
        margin-bottom: 0;
        transition-delay: 0s;
    }
    
    .image-container.active {
        transform: scale(1);
        margin-bottom: 0;
        transition-delay: 0.1s;
    }
    
    .portfolio-container.active {
        transform: scale(1);
        margin-bottom: 0;
        transition-delay: 0.2s;
    }
    
    .portfolio-container.active.leaving {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
        transition-delay: 0s;
        transition-duration: 0.3s;
    }
    
    .image-container.active.leaving {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
        transition-delay: 0.3s;
        transition-duration: 0.3s;
    }
    
    .bio-container.active.leaving {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
        transition-delay: 0.4s;
        transition-duration: 0.3s;
    }
    
    .cards-wrapper:has(.card.active) {
        gap: 0px;
    }
    
    .list {
        transition: all 0.3s ease-out;
        position: relative;
        background-color: transparent;
        padding: 0rem 0.5rem;
        border-radius: 0.375rem;
    }
    
    .list.hovered {
        background-color: #f3f4f6;
    }
    
    .list.others-hovered {
        opacity: 0.5;
    }

    @media (max-width: 768px) {
        .middle-container {
            padding-left: 18px !important;
            padding-right: 18px !important;
            width: 100% !important;
        }

        .cards-wrapper {
            display: none !important;
        }

        .list {
            padding: 0.5rem;
        }
    }
</style>

