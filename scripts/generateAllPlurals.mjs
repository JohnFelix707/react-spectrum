import {JSDOM} from 'jsdom';

function getRange(row) {
  let range = [];

  let th = row.firstElementChild;

  do {
    const { textContent } = th;

    let [start, end = start] = textContent.split('-');

    if (start === '') {
      range.push([]);
    } else {
      start = start.replace(/\.x$/, '.1');
      end = end.replace(/\.x$/, '.1');

      range.push([Number(start), Number(end)]);
    }
  } while ((th = th.nextElementSibling));

  return range;
}

function getLocales(cell) {
  let locales = [];

  let element = cell.firstElementChild;

  do {
    if (element.tagName === 'SPAN') {
      locales.push(element.title);
    }
  } while ((element = element.nextElementSibling));

  return locales;
}

function getPlurals(tr, categories, range) {
  const rules = Object.fromEntries(categories.map((key) => [key, []]));

  let td = tr.firstElementChild;

  let index = 1;

  do {
    const category = td.title;

    let columns = td.hasAttribute('colspan')
      ? Number(td.getAttribute('colspan'))
      : 1;

    do {
      rules[category].push(range[index]);

      index++;
    } while (columns-- > 1);
  } while ((td = td.nextElementSibling));

  return rules;
}

function extractTable(dom, integerTable, fractionTable) {
  function extract(table) {
    const tbody = table.querySelector('tbody');

    let tr = tbody.firstElementChild;

    let current;
    let results = {};

    do {
      if (tr.firstElementChild.tagName === 'TH') {
        if (current) {
          for (const language of current.languages) {
            if (!results[language]) {
              results[language] = Object.fromEntries(
                Object.keys(current.rules).map((key) => [key, []])
              );
            }

            for (let rule in current.rules) {
              results[language][rule] = [].concat(
                results[language][rule],
                current.rules[rule]
              );
            }
          }
        }

        current = {
          range: [],
          languages: [],
          rules: {},
        };

        current.range = getRange(tr);
      } else if (
        tr.children[1] instanceof dom.window.HTMLTableCellElement &&
        tr.children[1].classList.contains('l')
      ) {
        current.languages = getLocales(tr.children[1]);
      } else {
        const [lang] = current['languages'];

        const { pluralCategories } = new Intl.PluralRules(
          lang
        ).resolvedOptions();

        current.rules = getPlurals(tr, pluralCategories, current.range);
      }
    } while ((tr = tr.nextElementSibling));

    return results;
  }

  const integer = extract(integerTable);
  const fraction = extract(fractionTable);

  let values = new Set();

  for (let language in integer) {
    for (let rule in integer[language]) {
      if (integer[language][rule].length > 1) {
        values.add(integer[language][rule][0][0]);
      }
    }
  }

  for (let language in fraction) {
    for (let rule in fraction[language]) {
      if (fraction[language][rule].length > 1) {
        values.add(fraction[language][rule][0][0]);
      }
    }
  }

  return Array.from(values);
}

fetch('https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html#comparison')
  .then(async (response) => {
    let data = await response.text();
    const dom = new JSDOM(data);

    const [integerTable, fractionTable] = dom.window.document.querySelectorAll('.pluralComp');

    let values = extractTable(dom, integerTable, fractionTable);
    console.log(values);
  });
