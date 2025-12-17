<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">第三步：選擇日期與時間</h2>
    <p class="text-body-1 mb-6">請選擇您希望的預約時段。</p>
    
    <v-row>
      <v-col cols="12" md="7">
        <v-date-picker 
            v-model="selectedDate"
            color="primary"
            full-width
            :min="minDate"
            locale="zh-TW" 
        ></v-date-picker>
      </v-col>
      
      <v-col cols="12" md="5" class="mt-4 mt-md-0">
        <h3 class="text-h6 mb-4">選擇時間 ({{ formattedSelectedDate }})</h3>
        <v-chip-group
          v-model="selectedTime"
          mandatory
          active-class="time-chip--active"
          column
        >
          <v-chip
            v-for="time in availableTimes"
            :key="time"
            :value="time"
            :disabled="isTimeDisabled(time)"
            label
            size="large"
            class="w-100 justify-center mb-2 time-chip"
          >
            {{ time }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col cols="6">
        <v-btn 
            variant="text"
            block
            @click="router.back()"
        >
            返回上一步
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn 
            :disabled="!selectedDate || !selectedTime || isTimeDisabled(selectedTime)"
            color="primary"
            size="large"
            rounded="xl"
            block
            @click="nextStep"
        >
            下一步
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/bookingStore';
import * as fnsTz from 'date-fns-tz';

const router = useRouter();
const bookingStore = useBookingStore();

const timeZone = 'Asia/Taipei';

const today = new Date();
const selectedDate = ref(bookingStore.currentBooking.bookingDate ? new Date(bookingStore.currentBooking.bookingDate) : today);
const minDate = ref(fnsTz.formatInTimeZone(today, timeZone, 'yyyy-MM-dd'));

const availableTimes = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// --- Reordered Declarations ---

const formattedSelectedDate = computed(() => {
    if (!selectedDate.value) return '';
    return fnsTz.formatInTimeZone(selectedDate.value, timeZone, 'yyyy-MM-dd');
});

const isTodaySelected = computed(() => {
    const todayStr = fnsTz.formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd');
    return formattedSelectedDate.value === todayStr;
});

const currentTime = computed(() => {
    return fnsTz.formatInTimeZone(new Date(), timeZone, 'HH:mm');
});

function isTimeDisabled(time) {
    if (!isTodaySelected.value) {
        return false;
    }
    return time < currentTime.value;
}

// Set default time, avoiding disabled times
const firstAvailableTime = computed(() => availableTimes.find(time => !isTimeDisabled(time)));
const selectedTime = ref(bookingStore.currentBooking.bookingTime || firstAvailableTime.value || '');

// Final check to ensure selectedTime is not disabled on initial load
if(selectedTime.value && isTimeDisabled(selectedTime.value)) {
    selectedTime.value = firstAvailableTime.value || '';
}

const nextStep = () => {
  if(selectedDate.value && selectedTime.value && !isTimeDisabled(selectedTime.value)) {
    const date = fnsTz.formatInTimeZone(selectedDate.value, timeZone, 'yyyy-MM-dd');
    bookingStore.setDateTime(date, selectedTime.value);
    router.push('/booking/confirmation');
  }
};
</script>

<style scoped>
.time-chip {
  background-color: #f5f5f5; /* Light Grey Background */
  border: 1px solid #e0e0e0; /* Medium Grey Border */
  color: #616161;             /* Darker Grey for text */
  border-radius: 28px !important;
  transition: all 0.2s ease;
  font-weight: 500;
}

.time-chip:not(.v-chip--disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 140, 0, 0.2); /* Keep orange glow on hover */
  border-color: #FB8C00;
  color: #FB8C00;
}

.time-chip--active {
  background: #FB8C00 !important;
  color: white !important;
  border-color: #FB8C00 !important;
  font-weight: bold;
}

.time-chip.v-chip--disabled {
  background-color: #f5f5f5 !important;
  border-color: #e0e0e0 !important;
  color: #bdbdbd !important;
  opacity: 0.8;
}
</style>
