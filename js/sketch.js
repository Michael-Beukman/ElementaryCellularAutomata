var cDiv = document.getElementById('canvasDiv');
var h = cDiv.offsetHeight;
var w = cDiv.offsetWidth;
let all_arrays;
let num_cols = 41;
let tile_size;
let all_rules;
let K = 0;
let speed = 100;
const NUM_FRAMES = 100;

let millis_now;

let num_things = 16;

/**
 * This simply updates the values with the form inputs.
 * @param 
 */
function resetValues({
    rule,
    start = "1",
    num_things_=16,
    speed_ = 100,
    num_cols_ = 41
}) {
    if (Math.sqrt(num_things_) != Math.round(Math.sqrt(num_things_))){
        alert("The number of blocks needs to be a square number. Defaulting to 16")
        num_things = 16;
    }
    num_cols = Math.floor(num_cols_ / 2) * 2 + 1;
    tile_size = w / num_cols;

    num_things = num_things_;
    speed = 1000 / speed_;

    if (start.length == 0) start = "1";
    if (start.length % 2 != 1) {
        alert("The length needs to be odd. Defaulting to 1")
        start = "1";
    }
    all_arrays = [];
    all_rules = []
    const rule_num = parseInt(rule);
    const each_side = Math.floor(start.length / 2);
    const my_center = Math.floor(num_cols / 2);
    const other_center = Math.floor(start.length / 2);

    // for each rule, simply make the starting array.
    for (let i = 0; i < num_things; ++i) {
        all_rules.push(get_rule_from_num(rule_num + i));
        const array = [
            get_empty_array(num_cols)
        ];
        for (let i = -each_side; i <= each_side; ++i) {
            const j = my_center + i;
            if (j < 0 || j >= array[0].length) continue;
            array[0][j] = start[other_center + i] == "1" ? 1 : 0;
        }
        all_arrays.push(array);
    }
}

function setup() {
    // setup
    let canvas = createCanvas(w, h);
    canvas.parent(cDiv);
    millis_now = millis();
    colorMode(HSB, 255);

}

function get_empty_array(N) {
    return Array(N).fill(0);
}

/**
 * Uses the rule to update the state
 * @param {Array} current 
 * @param {Array} rule 
 * @returns 
 */
function update(current, rule) {
    const newArr = get_empty_array(current.length);

    for (let i = 0; i < newArr.length; ++i) {
        let a = 0,
            b = current[i],
            c = 0;
        if (i >= 1) a = current[i - 1];

        if (i < current.length - 1) c = current[i + 1];

        // now the rule
        const bin = a * 4 + b * 2 + c;
        newArr[i] = rule[7 - bin];
    }

    return newArr;
}

/**
 * Draws everything
 * 
 */
function draw() {
    background(0);
    const N = round(sqrt(num_things));
    noStroke();
    push();
    // make the N^2 smaller windows
    scale(1 / N, 1 / N)
    for (let row = 0; row < N; ++row) {
        for (let col = 0; col < N; ++col) {
            const idx = row * N + col;
            const array = all_arrays[idx];
            const colour = 255 * (idx + 1) / num_things;
            
            // translate to the correct location
            push();
            translate(width * row, height * col);
            for (let row = 0; row < array.length; ++row) {
                for (let col = 0; col < array[row].length; ++col) {
                    const cell = array[row][col];
                    // fill using a colour
                    if (cell){
                        fill(colour, 200, 150);
                        rect(col * tile_size, row * tile_size, tile_size, tile_size)
                    }
                    else{
                        fill(0, 0, 0);
                        rect(col * tile_size, row * tile_size, tile_size, tile_size)
                    }
                    // rectangle
                }
            }
            pop();
        }
    }
    pop();
    stroke(255, 0, 255)
    strokeWeight(1)

    for (let row = 0; row < N; ++row) {
        line(0, row / N * height, width, row / N * height)
    }
    for (let col = 0; col < N; ++col) {
        line(col / N * width, 0, col / N * width, height);
    }

    // update based on the speed
    should_update = (millis() - millis_now) > speed;
    if (should_update) {
        millis_now = millis();
        // update all arrays
        for (let i = 0; i < num_things; ++i) {
            const array = all_arrays[i];
            array.push(update(array[array.length - 1], all_rules[i]));
            
            // move this down if it gets too big
            if ((array.length - 1) * tile_size >= height)
                array.shift();
        }
    }
    return;
}

/**
 * Basically converts the rule number / id to binary to use as a proper rule
 * @param {number} num : The number to represent the rule.
 * @returns 
 */
function get_rule_from_num(num) {
    num = num % 256;
    const rule = Array(8).fill(0);
    for (let i = 0; i < 8; ++i) {
        let modder = num % 2;
        rule[rule.length - i - 1] = modder;
        num = Math.floor(num / 2);
    }
    return rule;
}