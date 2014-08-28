
$vic(document).ready(function() {
    loading(false);
    enableSortableSlots();

    //Display all buttons except the disabled after they have been disabled (by updateSlotActions functions)
    setTimeout(function() {
        $vic.each($vic('.vic-new-widget'), function() {
            if (!$vic(this).hasClass("vic-new-widget-disabled")) {
                $vic(this).removeClass('vic-hidden');
            }
        }) ;
    }, 10);
});


// Functions
////////////

function trackChange(elem)
{
    if ($vic(elem).val() === 'url') {
        $vic(elem).parent('li').children('.url-type').show();
        $vic(elem).parent('li').children('.page-type').hide();
        $vic(elem).parent('li').children('.route-type').hide();
    } else if ($vic(elem).val() === 'page') {
        $vic(elem).parent('li').children('.page-type').show();
        $vic(elem).parent('li').children('.url-type').hide();
        $vic(elem).parent('li').children('.route-type').hide();
    } else if ($vic(elem).val() === 'route') {
        $vic(elem).parent('li').children('.page-type').hide();
        $vic(elem).parent('li').children('.url-type').hide();
        $vic(elem).parent('li').children('.route-type').show();
    }
}


/**
 * This function is used to update the slot actions (Add some widget )
 * @param  {integer} slot the id of the slot
 * @param  {integer} max  the max number of items
 *
 * @return {void}
 */
function updateSlotActions(slot, max)
{
    var count = $vic('.vic-widget-container', "#vic-slot-"+slot).size();
    if ( max == undefined || count < max ) {
        $vic(".vic-new-widget", "#vic-slot-"+slot).removeClass('vic-new-widget-disabled');
    } else {
        $vic(".vic-new-widget", "#vic-slot-"+slot).addClass('vic-new-widget-disabled');
    }
}

function enableSortableSlots(){
    $vic(".vic-slot").each(function(){
        $vic(this).sortable({
            revert: true,
            handle: '.vic-hover-widget',
            items: ".vic-widget-container:not(.vic-undraggable)",
            placeholder: "vic-ui-state-highlight",

            forcePlaceholderSize: true,
            revert: true,
            stop: function( event, ui ) {
                var ajaxCall = updatePosition(ui);
                var fail = false;
                ajaxCall.fail(function(){
                    $vic(".vic-slot").each(function(){
                        $vic(this).sortable('cancel');
                    });
                });

                replaceDropdown(ui);

            }

        });
    });
}

function updatePosition(ui){
    var sorted = {};
    $vic(".vic-slot").each(function(key, el){
        sorted[$vic(el).data('name')] = $vic(el).sortable('toArray', { attribute: 'data-id' });
    });

    return $vic.post(Routing.generate('victoire_core_widget_update_position', {'viewReference': viewId}),
        { 'sorted': sorted }
    );
}

function replaceDropdown(ui) {
    $(ui.item).children('.vic-dropdown').remove();
    $(ui.item).append($(ui.item).parents('.vic-slot').children('.vic-dropdown').clone());
}

function loading(value) {
    if (value == undefined) { //Switch mode
        $vic('.vic-topNavbar-logo').toggleClass('vic-loading');
    } else if (value === true) { //Run
        $vic('.vic-topNavbar-logo').addClass('vic-loading');
    } else if (value === false) { //Stop
        $vic('.vic-topNavbar-logo').removeClass('vic-loading');
    }
}

