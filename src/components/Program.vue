<template>
  <div class="program">
    <h3>📋 Race Program</h3>
    <div v-if="program.length === 0" class="empty-state">
      Click "Generate New Race" to create a program
    </div>
    <div v-else class="rounds">
      <div
        v-for="(round, i) in program"
        :key="i"
        class="round"
        :class="{ 'active': i === currentRound, 'completed': i < currentRound }"
      >
        <div class="header">
          <span class="number">{{ i + 1 }}</span>
          <div class="info">
            <h4>Round {{ i + 1 }}</h4>
            <span class="distance">{{ round.distance }}m</span>
          </div>
          <div class="status">
            <span v-if="i < currentRound" class="completed">✅</span>
            <span
              v-else-if="i === currentRound && raceState === 'running'"
              class="running"
              >🏁</span
            >
            <span v-else class="pending">⏳</span>
          </div>
        </div>
        <div class="horses">
          <div
            v-for="(horse, index) in round.horses"
            :key="horse.id"
            class="card"
          >
            <span class="lane">{{ index + 1 }}</span>
            <span class="name">{{ horse.name }}</span>
            <span
              class="color"
              :style="{ backgroundColor: horse.color.toLowerCase() }"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const program = computed(() => store.state.program)
    const currentRound = computed(() => store.state.currentRound)
    const raceState = computed(() => store.state.raceState)

    return { program, currentRound, raceState }
  }
}
</script>

<style lang="scss" scoped>
.program {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 7px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;

  h3 {
    margin: 0 0 15px 0;
    color: #333;
    text-align: center;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
  }

  .empty-state {
    text-align: center;
    color: #6c757d;
    padding: 40px 20px;
    font-style: italic;
  }

  .rounds {
    max-height: 400px;
    overflow-y: auto;

    .round {
      margin-bottom: 15px;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      background: white;
      transition: all 0.3s ease;

      &.active {
        border-color: #007bff;
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);

        .header {
          background: #e3f2fd;
        }

        .number {
          background: #007bff;
        }
      }

      &.completed {
        border-color: #28a745;
        background: #f8fff9;

        .header {
          background: #e8f5e8;
        }

        .number {
          background: #28a745;
        }
      }

      .header {
        display: flex;
        align-items: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 6px 6px 0 0;
        gap: 10px;
      }

      .number {
        width: 30px;
        height: 30px;
        background: #6c757d;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
      }

      .info {
        flex: 1;

        h4 {
          margin: 0;
          color: #333;
          font-size: 14px;
        }

        .distance {
          color: #6c757d;
          font-size: 12px;
        }
      }

      .status {
        font-size: 16px;

        .running {
          animation: pulse 1s infinite;
        }
      }

      .horses {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;

        .card {
          display: flex;
          align-items: center;
          padding: 4px 6px;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 11px;
          gap: 6px;

          .lane {
            width: 16px;
            height: 16px;
            background: #6c757d;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: bold;
          }

          .name {
            flex: 1;
            font-weight: 500;
            color: #495057;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .color {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid #ccc;
          }
        }
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }
  @media (max-width: 768px) {
    .rounds .round .horses {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
}
</style>
