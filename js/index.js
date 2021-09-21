/// <reference path="../p5.d/p5.global-mode.d.ts" />

function formSubmit() {
    values = getValues();
    resetValues(values);
    return false;

}

// Get values from the form
const getValues = () => {
    const rule = parseInt($('#inpRule')[0].value);
    const start = $('#inpStart')[0].value;
    const speed_ = parseFloat($('#inpSpeed')[0].value);
    const num_things_ = parseInt($('#inpNumBlocks')[0].value);
    const num_cols_ = parseInt($('#inpTiles')[0].value);
    return {
        rule,
        start,
        speed_,
        num_things_,
        num_cols_
    };
}


$("#inpRule").on('input', ()=>{
    formSubmit();
})
resetValues(getValues());