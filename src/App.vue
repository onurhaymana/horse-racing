<template>
    <h1>🏇 Horse Racing Game</h1>
    <RaceControls />
    <div class="layout">
      <HorseList />
      <RaceTrack
        data-testid="race-track"
        v-if="raceState === 'running' || raceState === 'idle' || raceState === 'paused'"
      />
      <Results 
        v-else-if="raceState === 'finished'" 
        class="center-results" 
        data-testid="results"
      />
      <div class="right-panel">
        <Program />
        <Results 
          v-if="raceState !== 'finished'" 
          data-testid="results"
        />
      </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import HorseList from './components/HorseList.vue'
import RaceTrack from './components/RaceTrack.vue'
import Program from './components/Program.vue'
import Results from './components/Results.vue'
import RaceControls from './components/RaceControls.vue'

export default {
  components: {
    HorseList,
    RaceTrack,
    Program,
    Results,
    RaceControls
  },
  setup() {
    const store = useStore()
    const raceState = computed(() => store.state.raceState)

    return { raceState }
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  font-family: Figtree, Arial, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .layout {
    display: flex;
    gap: 1.5rem;
    min-height: 500px;

    .right-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 300px;

      @media (max-width: 1200px) {
        width: 100%;
        flex-direction: row;
      }
      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .center-results {
      flex: 1;
      margin-right: 1.5rem;
    }

    @media (max-width: 1200px) {
      flex-direction: column;
    }
  }
}

@media (max-width: 768px) {
  body {
    padding: 10px;
  }
}
</style>
