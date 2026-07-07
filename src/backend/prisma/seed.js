require('dotenv/config');
const prisma = require('../db.js');

// Source: https://housing.ufl.edu/housing-living-options/
const dorms = [
    'Beaty Towers',
    'Broward Hall',
    'Buckman Hall',
    'Cypress Hall',
    'East Hall',
    'Fletcher Hall',
    'Hume Hall',
    'Infinity Hall',
    'Jennings Hall',
    'Keys Residential Complex',
    'Lakeside Residential Complex',
    'Mallory Hall',
    'Murphree Hall',
    'North Hall',
    'Rawlings Hall',
    'Reid Hall',
    'Riker Hall',
    'Sledd Hall',
    'Springs Residential Complex',
    'Thomas Hall',
    'Tolbert Hall',
    'Weaver Hall',
    'Yulee Hall',
];

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
    for (const name of dorms) {
        const imageUrl = `/images/dorms/${slugify(name)}.jpg`;
        await prisma.dorm.upsert({
            where: { name },
            update: { imageUrl },
            create: { name, imageUrl },
        });
    }
    console.log(`Seeded ${dorms.length} dorms.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
