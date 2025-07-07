<template>
  <h1>🏇 Horse Racing Game</h1>
  <RaceControls />
  <div class="layout">
    <HorseList />
    <div class="right-panel">///Right panel coming</div>
  </div>
</template>

<script>
import HorseList from "./components/HorseList.vue";
import RaceControls from './components/RaceControls.vue'

export default {
  components: {
    HorseList,
    RaceControls
  },
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  font-family: Figtree, Arial, sans-serif, apple color emoji, segoe ui emoji,
    segoe ui symbol, noto color emoji;
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
