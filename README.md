# pug-scss-constructor
PUG/SCSS сборщик сайтов
Структура проекта
components - подключаемые блоки для страниц html
components/template.pug - шаблон сайта, от него наследуются все страницы
css - папка со стилями (sources)
fonts - папка со шрифтами
html - страницы html
images - папка с картинками для шаблона (можно использовать подразделы)
js - папка с js файлами (sources)
svg-sprite - папка с иконками для спрайта svg (images/sprite.svg)
uploads - папка с картинками для контента (компилируется в /upload/temp)
dist - папка для библиотек css, js
readme - текущий документ

Для запуска полной сборки
gulp build

Для запуска сборки js
gulp js

Для запуска сборки css
gulp css

Для запуска сборки html
gulp html

Для запуска сборки дистрибутивов библиотек css, js
gulp dist

Для отслеживания изменений и автоматической сборки
gulp watch
