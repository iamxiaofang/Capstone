// js files
import { handleSubmit, updateHTML } from './js/formHandler'

// sass files
import './styles/resets.scss'
import './styles/colors.scss'
import './styles/typography.scss'
import './styles/base.scss'

import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', handleSubmit);
});

export {
    handleSubmit
}