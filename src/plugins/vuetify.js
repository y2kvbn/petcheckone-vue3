import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { zhHant } from 'vuetify/locale';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Import MDI CSS

const petCheckOneTheme = {
    dark: false,
    colors: {
        primary: '#f5a623', // A warm, friendly orange
        secondary: '#78909c', // A calm, muted blue-grey
        accent: '#f78da7', // A soft, playful pink
        error: '#ef5350', // A standard error red
        background: '#f8f9fa', // A very light grey for the background
        surface: '#ffffff', // White for cards and surfaces
    },
};

export default createVuetify({
    components,
    directives,
    icons: { // Add this icons block
        defaultSet: 'mdi', 
    },
    locale: {
        locale: 'zhHant',
        fallback: 'en',
        messages: { zhHant },
    },
    theme: {
        defaultTheme: 'petCheckOneTheme',
        themes: {
            petCheckOneTheme,
        },
    },
});
