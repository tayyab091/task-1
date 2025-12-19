function toggleFeedback() {
    const hiddenItems = document.querySelectorAll('.feedback-item.hidden');
    const expandBtn = document.querySelector('.expand-btn');
    
    if (hiddenItems.length > 0) {
        hiddenItems.forEach(item => {
            item.classList.remove('hidden');
            item.classList.add('visible');
        });
        expandBtn.textContent = 'View Less';
    } else {
        const allItems = document.querySelectorAll('.feedback-item');
        for (let i = 2; i < allItems.length; i++) {
            allItems[i].classList.remove('visible');
            allItems[i].classList.add('hidden');
        }
        expandBtn.textContent = 'View More';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const expandBtn = document.querySelector('.expand-btn');
    expandBtn.addEventListener('click', toggleFeedback);
});
