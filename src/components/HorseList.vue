<template>
  <div class="horse-list">
    <h3>🐎 Horse Roster (1-20)</h3>
    <span v-if="horses.length === 0" class="no-horses">Horses are being prepared...</span>
    <div v-else class="list-container">
      <div class="list-header">
        <div class="header-cell name-header">Name</div>
        <div class="header-cell condition-header">Condition</div>
        <div class="header-cell color-header">Color</div>
      </div>
      <div class="list-body">
        <div v-for="horse in horses" :key="horse.id" class="horse-row">
          <div class="cell horse-name">{{ horse.name }}</div>
          <div class="cell condition">
            <div class="condition-bar">
              <div
                class="condition-fill"
                :style="{ width: horse.condition + '%', backgroundColor: getConditionColor(horse.condition) }"
              ></div>
              <span class="condition-text">{{ horse.condition }}</span>
            </div>
          </div>
          <div class="cell color-cell">
            <span
              class="dot"
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
    const horses = computed(() => store.state.horses)

    const getConditionColor = (condition) => {
      if (condition >= 80) return '#4CAF50'
      if (condition >= 60) return '#FFC107'
      if (condition >= 40) return '#FF9800'
      return '#F44336'
    }

    return { horses, getConditionColor }
  }
}
</script>

<style lang="scss" scoped>
.horse-list {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 18px;
    text-align: center;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
  }

  .no-horses {
    display: block;
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
    font-style: italic;
    font-size: 16px;
  }

  .list-container {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 6px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .list-header {
      display: flex;
      background: #343a40;
      position: sticky;
      top: 0;
      z-index: 1;

      .header-cell {
        color: white;
        padding: 12px 8px;
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        &.name-header {
          flex: 2;
        }

        &.condition-header {
          flex: 1.5;
        }

        &.color-header {
          flex: 1;
        }
      }
    }

    .list-body {
      .horse-row {
        display: flex;
        border-bottom: 1px solid #dee2e6;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f8f9fa;
        }

        &:last-child {
          border-bottom: none;
        }

        .cell {
          padding: 10px 8px;
          display: flex;
          align-items: center;
          font-size: 12px;

          &.horse-name {
            flex: 2;
            font-weight: 500;
            color: #495057;
          }

          &.condition {
            flex: 1.5;
          }

          &.color-cell {
            flex: 1;
            gap: 6px;
          }
        }
      }
    }

    .condition {
      &-bar {
        position: relative;
        width: 100%;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
      }

      &-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 0.3s ease;
      }

      &-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
        font-weight: bold;
        color: #333;
      }
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid #ccc;
      flex-shrink: 0;
    }
  }
}
</style>
