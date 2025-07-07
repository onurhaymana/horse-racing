<template>
  <div class="results">
    <h3>🏆 Race Results</h3>
    <div v-if="results.length === 0" class="empty-state">
      Results will appear here after races complete
    </div>
    <div v-else class="container">
      <div v-if="isAllRacesCompleted" class="banner">
        🎉 All Races Completed! 🎉
      </div>
      <div v-for="(result, i) in results" :key="i" class="round">
        <div class="header">
          <h4>Round {{ i + 1 }} Results</h4>
          <span class="distance">{{ result.distance }}m</span>
        </div>
        <div class="podium">
          <div class="positions">
            <div
              v-for="(horse, position) in result.positions"
              :key="horse.id"
              class="position"
              :class="getPositionClass(position)"
            >
              <div class="number">{{ position + 1 }}</div>
              <div class="info">
                <span class="name">{{ horse.name }}</span>
                <div class="details">
                  <span
                    class="dot"
                    :style="{ backgroundColor: horse.color.toLowerCase() }"
                  ></span>
                  <span class="condition">{{ horse.condition }}</span>
                </div>
              </div>
              <div v-if="position < 3" class="medal">
                {{ getMedal(position) }}
              </div>
            </div>
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
    const results = computed(() => store.state.results)
    const raceState = computed(() => store.state.raceState)
    const isAllRacesCompleted = computed(() => raceState.value === 'finished')

    const getPositionClass = (position) => {
      if (position === 0) return 'first'
      if (position === 1) return 'second'
      if (position === 2) return 'third'
      return 'other'
    }

    const getMedal = (position) => {
      const medals = ['🥇', '🥈', '🥉']
      return medals[position] || ''
    }

    return { results, getPositionClass, getMedal, isAllRacesCompleted }
  }
}
</script>

<style lang="scss" scoped>
.results {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
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

  .container {
    max-height: 400px;
    overflow-y: auto;

    .banner {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      text-align: center;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
      animation: celebrate 2s ease-in-out;
    }

    .round {
      margin-bottom: 20px;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background: white;
      overflow: hidden;

      .header {
        background: linear-gradient(135deg, #ffd700, #ffa500);
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
          margin: 0;
          color: #333;
          font-size: 14px;
        }

        .distance {
          color: #666;
          font-size: 12px;
          font-weight: bold;
        }
      }

      .podium {
        .positions {
          padding: 10px;

          .position {
            display: flex;
            align-items: center;
            padding: 8px 10px;
            margin-bottom: 5px;
            border-radius: 6px;
            transition: all 0.3s ease;
            gap: 10px;

            &:hover {
              transform: translateX(5px);
            }

            &.first {
              background: linear-gradient(135deg, #ffd700, #fff8dc);
              border: 2px solid #ffd700;

              .number {
                background: #ffd700;
                color: #333;
              }
            }

            &.second {
              background: linear-gradient(135deg, #c0c0c0, #f5f5f5);
              border: 2px solid #c0c0c0;

              .number {
                background: #c0c0c0;
                color: #333;
              }
            }

            &.third {
              background: linear-gradient(135deg, #cd7f32, #f4e4bc);
              border: 2px solid #cd7f32;

              .number {
                background: #cd7f32;
              }
            }

            &.other {
              background: #f8f9fa;
              border: 1px solid #dee2e6;
            }

            .number {
              width: 24px;
              height: 24px;
              background: #6c757d;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              min-width: 24px;
            }

            .info {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 2px;

              .name {
                font-weight: 600;
                color: #333;
                font-size: 13px;
              }

              .details {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: #6c757d;

                .dot {
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  border: 1px solid #ccc;
                }

                .condition {
                  font-weight: 500;
                }
              }
            }

            .medal {
              font-size: 20px;
              animation: sparkle 2s infinite;
            }
          }
        }
      }
    }
  }

  @keyframes celebrate {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes sparkle {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
}

.center-results {
  .results {
    min-height: 500px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #dee2e6;

    h3 {
      font-size: 24px;
      margin-bottom: 25px;
    }

    .container {
      max-height: none;
      height: auto;

      .round {
        margin-bottom: 25px;
        padding: 20px;
        border: 2px solid #dee2e6;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
