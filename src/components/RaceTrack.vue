<template>
  <div class="track">
    <div class="header">
      <h3 v-if="currentRound < program.length">
        Round {{ currentRound + 1 }} - {{ program[currentRound]?.distance }}m
      </h3>
      <div v-if="raceState === 'running'" class="status">
        🏁 Race in Progress...
      </div>
    </div>
    <div class="lanes">
      <div v-for="(horse, index) in currentHorses" :key="horse.id" class="lane">
        <div class="number">{{ index + 1 }}</div>
        <div class="container">
          <div class="line">
            <div class="horse" :style="getHorseStyle(horse, index)">🐎</div>
          </div>
          <div class="finish"></div>
        </div>
        <div class="info">
          <span :style="{ color: horse.color.toLowerCase() }">{{
            horse.name
          }}</span>
          <span class="condition">({{ horse.condition }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const horsePositions = ref({});
    const animationState = ref({
      startTime: null,
      pausedAt: null,
      totalPausedTime: 0,
      horseSpeeds: {},
      isAnimating: false,
    });

    const program = computed(() => store.state.program);
    const currentRound = computed(() => store.state.currentRound);
    const raceState = computed(() => store.state.raceState);
    const currentHorses = computed(
      () => store.state.program[currentRound.value]?.horses || []
    );

    // Initialize horse positions when horses change
    watch(
      currentHorses,
      (newHorses) => {
        const positions = {};
        newHorses.forEach((horse) => {
          positions[horse.id] = 0;
        });
        horsePositions.value = positions;
        // Reset animation state for new round
        animationState.value = {
          startTime: null,
          pausedAt: null,
          totalPausedTime: 0,
          horseSpeeds: {},
          isAnimating: false,
        };
      },
      { immediate: true }
    );

    // Watch for race state changes
    watch(
      [raceState, currentRound],
      ([newRaceState], [oldRaceState]) => {
        if (newRaceState === "running" && currentHorses.value.length > 0) {
          if (oldRaceState === "paused") {
            // Resume from pause
            resumeAnimation();
          } else {
            // Start new race
            startNewAnimation();
          }
        } else if (
          newRaceState === "paused" &&
          animationState.value.isAnimating
        ) {
          pauseAnimation();
        }
      }
    );

    const startNewAnimation = () => {
      const horses = currentHorses.value;

      // Initialize horse speeds (constant for each horse during the race)
      const horseSpeeds = {};
      horses.forEach((horse) => {
        const baseSpeed = horse.condition / 100;
        const randomFactor = 0.85 + Math.random() * 0.3;
        horseSpeeds[horse.id] = baseSpeed * randomFactor;

        // Reset position
        horsePositions.value = {
          ...horsePositions.value,
          [horse.id]: 0,
        };
      });

      animationState.value = {
        startTime: Date.now(),
        pausedAt: null,
        totalPausedTime: 0,
        horseSpeeds,
        isAnimating: true,
      };

      animateRace();
    };

    const pauseAnimation = () => {
      animationState.value.pausedAt = Date.now();
      animationState.value.isAnimating = false;
    };

    const resumeAnimation = () => {
      if (animationState.value.pausedAt) {
        const pauseDuration = Date.now() - animationState.value.pausedAt;
        animationState.value.totalPausedTime += pauseDuration;
        animationState.value.pausedAt = null;
      }
      animationState.value.isAnimating = true;
      animateRace();
    };

    const animateRace = () => {
      const horses = currentHorses.value;
      const duration = 4000; // 4 seconds total

      const animate = () => {
        if (
          !animationState.value.isAnimating ||
          raceState.value !== "running"
        ) {
          return;
        }

        const now = Date.now();
        const elapsed =
          now -
          animationState.value.startTime -
          animationState.value.totalPausedTime;
        const progress = Math.min(elapsed / duration, 1);

        horses.forEach((horse) => {
          const speed = animationState.value.horseSpeeds[horse.id];
          let position = progress * speed * 95;

          // Final stretch boost
          if (progress > 0.8) {
            const finalBoost = Math.sin((progress - 0.8) * Math.PI * 5) * 2;
            position += finalBoost * (horse.condition / 100);
          }

          position = Math.min(Math.max(position, 0), 95);

          horsePositions.value = {
            ...horsePositions.value,
            [horse.id]: position,
          };
        });

        if (progress < 1 && animationState.value.isAnimating) {
          requestAnimationFrame(animate);
        } else if (progress >= 1) {
          animationState.value.isAnimating = false;
          // Notify store that animation is complete
          store.dispatch("raceAnimationComplete");
        }
      };

      requestAnimationFrame(animate);
    };

    const getHorseStyle = (horse, index) => {
      const position = horsePositions.value[horse.id] || 0;
      return {
        left: `${position}%`,
        transition:
          raceState.value === "running"
            ? "left 0.1s ease-out"
            : "left 0.3s ease",
        transform: "translateY(-50%) scaleX(-1)",
        fontSize: "20px",
        zIndex: 10 - index, // Ensure proper layering
      };
    };

    return {
      currentHorses,
      getHorseStyle,
      program,
      currentRound,
      raceState,
    };
  },
};
</script>

<style lang="scss" scoped>
.track {
  flex: 1;
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(to bottom, #87ceeb 0%, #98fb98 30%, #228b22 100%);

  .header {
    background: #333;
    color: white;
    padding: 10px;
    text-align: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }

    .status {
      color: #ffd700;
      font-weight: bold;
      margin-top: 5px;
    }
  }

  .lanes {
    padding: 20px 10px;
    min-height: 350px;

    .lane {
      position: relative;
      height: 40px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 2px;

      .number {
        width: 30px;
        text-align: center;
        font-weight: bold;
        color: #333;
        background: #fff;
        border-radius: 50%;
        min-width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin-right: 8px;
      }

      .container {
        flex: 1;
        position: relative;
        height: 30px;
        margin-right: 8px;

        .line {
          width: 100%;
          height: 4px;
          background: repeating-linear-gradient(
            to right,
            #654321 0px,
            #654321 15px,
            #8b4513 15px,
            #8b4513 30px
          );
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

          .horse {
            position: absolute;
            top: 50%;
            left: 0;
            font-size: 20px;
            filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
            animation: gallop 0.8s ease-in-out infinite alternate;
          }
        }

        .finish {
          width: 4px;
          height: 100%;
          background: repeating-linear-gradient(
            to bottom,
            #ff0000 0px,
            #ff0000 4px,
            #ffffff 4px,
            #ffffff 8px
          );
          position: absolute;
          right: 2px;
          top: 0;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      }

      .info {
        width: 140px;
        font-size: 11px;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .condition {
          color: #666;
          font-size: 10px;
        }
      }
    }
  }
}

@keyframes gallop {
  0% {
    transform: translateY(-50%) translateY(-1px) rotate(-1deg);
  }
  100% {
    transform: translateY(-50%) translateY(1px) rotate(1deg);
  }
}
</style>
