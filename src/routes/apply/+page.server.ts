import type { PageServerLoad } from './$types';

export const load = (async () => {
    // These could come from a database or API in a real app
    const creativeCategories = [
        'Graphic Designer',
        'UI/UX Designer',
        'Motion Designer',
        'Illustrator',
        'Product Designer',
        'Brand Designer',
        'Other'
    ];
    
    return {
        creativeCategories
    };
}) satisfies PageServerLoad;