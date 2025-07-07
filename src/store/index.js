///Vuex store coming
function getRandomName(i) {
    const names = [
        'Thunder Bolt', 'Lightning Strike', 'Storm Chaser', 'Wind Runner', 'Fire Storm',
        'Golden Arrow', 'Silver Bullet', 'Midnight Express', 'Dawn Breaker', 'Star Gazer',
        'Wild Spirit', 'Brave Heart', 'Swift Wind', 'Noble Prince', 'Royal Crown',
        'Diamond Dust', 'Emerald Dream', 'Ruby Flash', 'Sapphire Sky', 'Crystal Clear'
    ]
    return names[i] || `Horse ${i + 1}`
}

function getRandomColor(i) {
    const colors = [
        'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Brown', 'Black', 'White', 'Gray',
        'Pink', 'Cyan', 'Magenta', 'Gold', 'Silver', 'Teal', 'Indigo', 'Maroon', 'Navy', 'Olive'
    ]
    return colors[i % colors.length]
}