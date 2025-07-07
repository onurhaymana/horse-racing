<template>
  <div class="controls">
    <button
      @click="generate"
      :disabled="raceState === 'running'"
      class="btn primary"
    >
      🎲 Generate New Race
    </button>
    <button
      @click="toggleRace"
      :disabled="program.length === 0 || raceState === 'finished'"
      class="btn"
      :class="getButtonClass()"
    >
      {{ getButtonText() }}
    </button>
    <div v-if="raceState !== 'idle'" class="info">
      <span class="status">Status: {{ getRaceStatus() }}</span>
      <span v-if="program.length > 0" class="progress">
        Round {{ Math.min(currentRound + 1, program.length) }} of
        {{ program.length }}
      </span>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  setup() {
    const store = useStore();
    const raceState = computed(() => store.state.raceState);
    const program = computed(() => store.state.program);
    const currentRound = computed(() => store.state.currentRound);

    const generate = () => {
      store.commit("generateHorses");
      store.commit("generateProgram");
      store.commit("resetGame");
    };

    const toggleRace = () => {
      if (raceState.value === "running") {
        store.dispatch("pauseRace");
      } else if (raceState.value === "paused") {
        store.dispatch("resumeRace");
      } else if (raceState.value === "idle" || raceState.value === "finished") {
        store.dispatch("startRace");
      }
    };

    const getButtonText = () => {
      switch (raceState.value) {
        case "running":
          return "⏸️ Pause Race";
        case "paused":
          return "▶️ Resume Race";
        case "finished":
          return "🏁 Race Finished";
        default:
          return "🏁 Start Race";
      }
    };

    const getButtonClass = () => {
      switch (raceState.value) {
        case "running":
          return "warning";
        case "paused":
          return "success";
        case "finished":
          return "info";
        default:
          return "success";
      }
    };

    const getRaceStatus = () => {
      switch (raceState.value) {
        case "running":
          return "Racing";
        case "paused":
          return "Paused";
        case "finished":
          return "Completed";
        default:
          return "Ready";
      }
    };

    return {
      generate,
      toggleRace,
      raceState,
      program,
      currentRound,
      getButtonText,
      getButtonClass,
      getRaceStatus,
    };
  },
};
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  .btn {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.primary {
      background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
      color: white;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #ff5252, #ff7777);
        transform: translateY(-2px);
      }
    }

    &.success {
      background: linear-gradient(135deg, #4caf50, #66bb6a);
      color: white;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #45a049, #5cb85c);
        transform: translateY(-2px);
      }
    }

    &.warning {
      background: linear-gradient(135deg, #ff9800, #ffb74d);
      color: white;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #f57c00, #ffa726);
        transform: translateY(-2px);
      }
    }

    &.info {
      background: linear-gradient(135deg, #2196f3, #42a5f5);
      color: white;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #1976d2, #2196f3);
        transform: translateY(-2px);
      }
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: white;
    font-weight: 500;

    .status {
      font-size: 14px;
    }

    .progress {
      font-size: 12px;
      opacity: 0.9;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;

    .info {
      align-items: center;
    }
  }
}
</style>
