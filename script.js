$(document).ready(function () {
    // Initial section to display
    let currentSection = 'persona';
    let currentKnowledgeView = 'knowledge-overview';

    // Show initial section
    showSection(currentSection);

    // Sidebar navigation click handling
    $('.sidebar-item').on('click', function () {
        const target = $(this).data('section');

        // Update sidebar UI
        $('.sidebar-item').removeClass('active');
        $(this).addClass('active');

        // Show section
        currentSection = target;
        showSection(currentSection);

        // If knowledge base, also show knowledge-overview
        if (currentSection === 'knowledge') {
            showKnowledgeSection(currentKnowledgeView);
        }
    });

    // Knowledge card click navigation
    $('.knowledge-card').on('click', function () {
        const type = $(this).data('type');
        currentKnowledgeView = type + '-form';
        showKnowledgeSection(currentKnowledgeView);
    });

    // Knowledge base back buttons
    $('.back-btn').on('click', function () {
        currentKnowledgeView = 'knowledge-overview';
        showKnowledgeSection(currentKnowledgeView);
    });

    // ✅ Conversation Style tab switching (Chat / Voice / Email)
    $('.tab-btn').on('click', function () {
        const tab = $(this).data('tab');

        // Toggle active tab button
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        // Hide all tab contents
        $('.tab-content').addClass('hidden');

        // Show the selected one
        $('#' + tab + '-tab').removeClass('hidden');

        // Update Guidelines label
        let labelText;
        if (tab === 'voice') labelText = 'Voice Guidelines';
        else if (tab === 'email') labelText = 'Email Guidelines';
        else labelText = 'Chat Guidelines';

        $('.form-label').each(function () {
            if ($(this).text().includes('Guidelines')) {
                $(this).text(labelText);
            }
        });
    });

    // Show main section
    function showSection(section) {
        $('.content-section').addClass('hidden');
        $('#' + section + '-section').removeClass('hidden');
    }

    // Show specific knowledge subview
    function showKnowledgeSection(viewId) {
        $('#knowledge-section').children('div').addClass('hidden');
        $('#' + viewId).removeClass('hidden');
    }

    // Debug
    console.log('Initialized sidebar navigation');
});

