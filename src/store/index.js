import { createStore } from 'vuex'

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

export default createStore({
  state: {
    horses: [],
    program: [],
  },
  mutations: {
    generateHorses(state) {
      state.horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: getRandomName(i),
        condition: Math.floor(Math.random() * 100) + 1,
        color: getRandomColor(i)
      }))
    },
    generateProgram(state) {
      const roundDistances = [1200, 1400, 1600, 1800, 2000, 2200]
      state.program = roundDistances.map(distance => {
        const shuffled = [...state.horses].sort(() => 0.5 - Math.random())
        return {
          distance,
          horses: shuffled.slice(0, 10)
        }
      })
    },
  },
})
