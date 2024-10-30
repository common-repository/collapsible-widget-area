jQuery(function ($) {
    if (typeof(collapsible_widget_area) === 'undefined') {
        collapsible_widget_area = {'1': {'type': 'tabbed'}};
    }

    for (let i in collapsible_widget_area) {

        let cwa_opts = {
            'collapsible': collapsible_widget_area[i].collapsible,
            'heightStyle': collapsible_widget_area[i].heightStyle
        };
        let defaultIndex = collapsible_widget_area[i].closed ? false : 0;
        let currentTab = defaultIndex;
        if (typeof(collapsible_widget_area[i].cookie) !== 'undefined' && collapsible_widget_area[i].cookie) {
            currentTab = localStorage.getItem('ciwa_current_tab-' + collapsible_widget_area[i].id);

            if (null === currentTab) {
                currentTab = defaultIndex;
            } else {
                currentTab = (currentTab * 1);
            }

            cwa_opts.activate = function (event, ui) {
                let containerId = $(event.target).attr('id');
                let tabIndex = $(ui.newPanel[0]).parent().find('.collapsible-item').index(ui.newPanel[0]);
                if ($(this).hasClass('ui-tabs')) {
                    tabIndex = $(this).tabs('option', 'active');
                } else {
                    tabIndex = $(this).accordion('option', 'active');
                }
                localStorage.setItem('ciwa_current_tab-' + containerId, tabIndex);
            }
        }
        if (window.location.hash && document.querySelectorAll(window.location.hash).length >= 1) {
            let selectedTab = $(window.location.hash);
            if (selectedTab.hasClass('collapsible-item')) {
                currentTab = selectedTab.parent().find('.collapsible-item').index(selectedTab);
            }
        }
        cwa_opts.active = currentTab;

        let $container = $('#' + collapsible_widget_area[i].id);

        if (collapsible_widget_area[i].type === 'accordion') {
            $container.find('.collapsible-item .widgettitle').each(function () {
                $(this).html($(this).text());
                $(this).wrapInner('<a href="#' + $(this).closest('.collapsible-item').attr('id') + '"/>');
                $(this).insertBefore($(this).closest('.collapsible-item'));
            });
            $container.find('.widgettitle').first().addClass('first-tab');
            $container.find('.widgettitle').last().addClass('last-tab');

            console.log(cwa_opts);

            $container.accordion(cwa_opts);
        } else {
            $container.prepend('<ul class="tab-nav"/>');
            $container.find('.collapsible-item .widgettitle').each(function () {
                $(this).wrapInner('<a href="#' + $(this).closest('.collapsible-item').attr('id') + '"/>');
                $(this).wrap('<li/>');

                let currentItem = $(this).find('a');
                $(currentItem).unwrap();
                $(currentItem).closest('li').appendTo($(currentItem).closest('.collapsible-widget-container').find('.tab-nav'));
            });
            $container.find('.tab-nav li').first().addClass('first-tab');
            $container.find('.tab-nav li').last().addClass('last-tab');

            $container.tabs(cwa_opts);
        }
    }
});