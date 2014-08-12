/*class Generator
{
  
    public static function generate(WordListInterface $wordList, $lenght = 4, $separator = ' ')
    {
        $words = array();
        foreach (range(1, $lenght) as $number) {
            $random = mt_rand() / mt_getrandmax();
            $words[] = $wordList->get($random);
        }
        
        return join($separator, $words);
    }

    public static function generateRuTranslit($lenght = 4, $separator = ' ')
    {
        return self::generate(new WordList\RuTranslit(), $lenght, $separator);
    }

    public static function generateRu($lenght = 4, $separator = ' ')
    {
        return self::generate(new WordList\Ru(), $lenght, $separator);
    }

    public static function generateEn($lenght = 4, $separator = ' ')
    {
        return self::generate(new WordList\En(), $lenght, $separator);
    }
}*/

// curry curry wahahaha
function charcodeat(num) {
    return function(str) {
        return str.charCodeAt(num);
    }
}

function add(a, b) {
    return a + b;
}

/*
object yobarandom
has seed
has function generate -> number 
*/
var Yoba_Random = function(seed) {
    var self = this;
    // seed is a string
    var seeed = (           // MAGIC
        seed                //    'abc' as example
        .split('')          // -> ['a', 'b', 'c']
        .map(charcodeat(0)) // -> [97, 98, 99]
        .map(Math.sin)      // -> [0.555555, 0.12312, -0.2315]
        .reduce(add)        // -> 123.1123
    );                      // values are random, just to show logic
    self.seed = Math.floor(Math.sin(seeed) * 1e10); // yep there is magic const
    self.generate = function(max) {
        // returns an in in range [0, max)
        return Math.floor(Math.abs(Math.sin(self.seed++)) * max)
    }
    self.choose = function(list) {
        // returns random element from list
        var n = self.generate(list.length);
        return list[n];
    }
}

$(document).ready(function() {
    var lang = $('select#lang');
    var seed = $('input[name="seed"]');
    var wordsnumber = $('input[name="wordsnumber"]');
    var spaces = $(':checkbox[name="spaces"]')
    var button = $('button#gen');
    var input = $('input[name="result"]');
    var test = $('div#test');
    var state = {
        lang: lang.val(),
        seed: undefined,
        randomgenerator: undefined
    }
    $.getJSON('data.json', function(data) {
        button.click(function(){
            var langlist = data[lang.val()]; // to choose lang from
            var seed_string = seed.val();
            if (!seed_string) {
                seed.val('я же просил!')
            }
            // state check
            var random;
            if (state.lang == lang.val() && state.seed == seed_string &&state.randomgenerator)
                random = state.randomgenerator;
            else {
                random = new Yoba_Random(seed.val());
                state.seed = seed_string;
                state.randomgenerator = random;
            }
            var times = parseInt(wordsnumber.val(), 10);
            var words = [];
            for (var i = 0; i < times; ++i)
                words.push(random.choose(langlist));
            var separator = spaces.prop('checked')? ' ' : '';
            var password = words.join(separator);
            input.val(password);
        });
    });
});
