/* GLOBAL SETTING VARIABLES */
let quest_shown_value;                  // default = 10
let ascending_sort_quest_list;          // default = true
let ascending_sort_quest_score;         // default = false
let hide_quest_score;                   // default = false
let min_quest_chapter;                  // default = 1
let max_quest_chapter;                  // default = whatever is the highest chapter
let quest_filter;                       // default = filter-all
let item_amount_per_row;                // default = 7

let quest_shown_value_default;
let ascending_sort_quest_list_default;
let ascending_sort_quest_score_default;
let hide_quest_score_default;
let min_quest_chapter_default;
let max_quest_chapter_default;
let quest_filter_default;
let item_amount_per_row_default;


function init_settings()
{
    // SETTINGS BEING STORED ON COOKIES HAVE BEEN DEPRECIATED. DELETE/IMPORT DATA.
    if (Cookies.get('quest_shown_value') ||
        Cookies.get('ascending_sort_quest_list') ||
        Cookies.get('ascending_sort_quest_score') ||
        Cookies.get('hide_quest_score') ||
        Cookies.get('min_quest_chapter') ||
        Cookies.get('max_quest_chapter') ||
        Cookies.get('quest_filter') ||
        Cookies.get('item_amount_per_row'))
    {
        if (typeof(Storage) !== "undefined")
        {
            let settings_map = new Map();
            settings_map.quest_shown_value = parseInt(Cookies.get('quest_shown_value'));
            settings_map.ascending_sort_quest_list = Cookies.get('ascending_sort_quest_list') === 'true';
            settings_map.ascending_sort_quest_score = Cookies.get('ascending_sort_quest_score') === 'true';
            settings_map.hide_quest_score = Cookies.get('hide_quest_score') === 'true';
            settings_map.min_quest_chapter = parseInt(Cookies.get('min_quest_chapter'));
            settings_map.max_quest_chapter = parseInt(Cookies.get('max_quest_chapter'));
            settings_map.quest_filter = Cookies.get('quest_filter');
            settings_map.item_amount_per_row = parseInt(Cookies.get('item_amount_per_row'));

            let encrypted_setting_map = JSON.stringify(settings_map);
            localStorage.setItem('settings', encrypted_setting_map);
        }
        Cookies.remove('quest_shown_value');
        Cookies.remove('ascending_sort_quest_list');
        Cookies.remove('ascending_sort_quest_score');
        Cookies.remove('hide_quest_score');
        Cookies.remove('min_quest_chapter');
        Cookies.remove('max_quest_chapter');
        Cookies.remove('quest_filter');
        Cookies.remove('item_amount_per_row');

        console.log("[Settings] - Removed/imported to LocalStorage found settings cookie data.");
    }

    // GET STARTING VALUES FROM COMPONENTS
    quest_shown_value_default = document.getElementById("quest-shown-amt").value;
    quest_shown_value = quest_shown_value_default;

    ascending_sort_quest_list_default = document.getElementById("sort-ascending-quest-list").checked;
    ascending_sort_quest_list = ascending_sort_quest_list_default;

    ascending_sort_quest_score_default = document.getElementById("sort-ascending-quest-score").checked;
    ascending_sort_quest_score = ascending_sort_quest_score_default;

    hide_quest_score_default = document.getElementById("hide-quest-score").checked;
    hide_quest_score = hide_quest_score_default;

    min_quest_chapter_default = document.getElementById("min-quest-chapter").value;
    min_quest_chapter = min_quest_chapter_default;

    max_quest_chapter_default = document.getElementById("max-quest-chapter").value;
    max_quest_chapter = max_quest_chapter_default;

    if (document.getElementById("filter-all-quests").checked)
    {
        quest_filter_default = "filter-all";
    }
    else if (document.getElementById("filter-normal-quests").checked)
    {
        quest_filter_default = "filter-normal";
    }
    else if (document.getElementById("filter-hard-quests").checked)
    {
        quest_filter_default = "filter-hard";
    }
    quest_filter = quest_filter_default;

    item_amount_per_row_default = document.getElementById("item-amount-per-row").value;
    item_amount_per_row = item_amount_per_row_default;

    console.log("[Settings] - Settings are initialized!");
}

function check_checkbox(elementID, checked)
{
    document.getElementById(elementID).checked = checked;
}

function change_quest_shown_amt()
{
    const max_value = document.getElementById("quest-shown-amt").max;
    const min_value = document.getElementById("quest-shown-amt").min;

    quest_shown_value = Math.round(document.getElementById("quest-shown-amt").value);

    if (quest_shown_value > max_value)
    {
        document.getElementById("quest-shown-amt").value = max_value;
        quest_shown_value = max_value;
    }
    if (quest_shown_value < min_value)
    {
        document.getElementById("quest-shown-amt").value = min_value;
        quest_shown_value = min_value;
    }

    console.log("[Settings] - Quest Shown Amount Updated to: " + quest_shown_value);

    refresh_quest_table();
}

function toggle_ascending_sort_quest_list()
{
    ascending_sort_quest_list = !ascending_sort_quest_list;
    console.log("[Settings] - Quest Results are not sorted by Ascending (Quest Chapter/Number): " + ascending_sort_quest_list);

    refresh_quest_table();
}

function toggle_ascending_sort_quest_score()
{
    ascending_sort_quest_score = !ascending_sort_quest_score;
    console.log("[Settings] - Quest Results are not sorted by Ascending (Quest Score): " + ascending_sort_quest_score);

    refresh_quest_table();
}

function toggle_hide_quest_score()
{
    hide_quest_score = !hide_quest_score;
    console.log("[Settings] - Quest scoring is now hidden: " + hide_quest_score);

    refresh_quest_table();
}

function change_min_quest_chapter()
{
    const max_value = document.getElementById("min-quest-chapter").max;
    const min_value = document.getElementById("min-quest-chapter").min;

    min_quest_chapter = Math.round(document.getElementById("min-quest-chapter").value);

    if (min_quest_chapter > max_value)
    {
        document.getElementById("min-quest-chapter").value = max_value;
        min_quest_chapter = max_value;
    }
    if (min_quest_chapter > max_quest_chapter)
    {
        document.getElementById("min-quest-chapter").value = max_quest_chapter;
        min_quest_chapter = max_quest_chapter;
    }
    if (min_quest_chapter < min_value)
    {
        document.getElementById("min-quest-chapter").value = min_value;
        min_quest_chapter = min_value;
    }

    console.log("[Settings] - Minimum Quest Shown Updated to: " + min_quest_chapter);

    refresh_quest_table();
}

function change_max_quest_chapter()
{
    const max_value = document.getElementById("max-quest-chapter").max;
    const min_value = document.getElementById("max-quest-chapter").min;

    max_quest_chapter = Math.round(document.getElementById("max-quest-chapter").value);

    if (max_quest_chapter > max_value)
    {
        document.getElementById("max-quest-chapter").value = max_value;
        max_quest_chapter = max_value;
    }
    if (max_quest_chapter < min_value)
    {
        document.getElementById("max-quest-chapter").value = min_value;
        max_quest_chapter = min_value;
    }
    if (max_quest_chapter < min_quest_chapter)
    {
        document.getElementById("max-quest-chapter").value = min_quest_chapter;
        max_quest_chapter = min_quest_chapter;
    }

    console.log("[Settings] - Maximum Quest Shown Updated to: " + max_quest_chapter);

    refresh_quest_table();
}

function change_quest_filter()
{
    if (document.getElementById("filter-all-quests").checked)
    {
        quest_filter = "filter-all";
    }
    else if (document.getElementById("filter-normal-quests").checked)
    {
        quest_filter = "filter-normal";
    }
    else if (document.getElementById("filter-hard-quests").checked)
    {
        quest_filter = "filter-hard";
    }

    console.log("[Settings] - Quest Filter Changed to: " + quest_filter);

    refresh_quest_table();
}

function change_item_amount_per_row()
{
    const max_value = document.getElementById("item-amount-per-row").max;
    const min_value = document.getElementById("item-amount-per-row").min;

    item_amount_per_row = Math.round(document.getElementById("item-amount-per-row").value);

    if (item_amount_per_row > max_value)
    {
        document.getElementById("item-amount-per-row").value = max_value;
        item_amount_per_row = max_value;
    }
    if (item_amount_per_row < min_value)
    {
        document.getElementById("item-amount-per-row").value = min_value;
        item_amount_per_row = min_value;
    }

    console.log("[Settings] - Item Amount Per Row Updated to: " + item_amount_per_row);

    build_item_tables();
}

function toggle_simple_mode()
{
    if(window.location.hash)
    {
        let hash = window.location.hash.substring(1);
        if (hash === "simple")
        {
            console.log("[Simple Mode] Simple Mode Enabled! (No Background Images)");
            document.getElementById("title-div").classList.toggle("no-background");
            document.getElementById("title-div").classList.toggle("no-transition");
            document.getElementById("title-div").classList.toggle("no-hover");
            document.getElementById("title-text-div").classList.toggle("no-hover");
            document.getElementById("common-div").classList.toggle("no-background");
            document.getElementById("copper-div").classList.toggle("no-background");
            document.getElementById("silver-div").classList.toggle("no-background");
            document.getElementById("gold-div").classList.toggle("no-background");
            document.getElementById("purple-div").classList.toggle("no-background");
            document.getElementById("misc-div").classList.toggle("no-background");
            document.getElementById("requested-div").classList.toggle("no-background");
            document.getElementById("required-div").classList.toggle("no-background");
            document.getElementById("recommended-div").classList.toggle("no-background");
            document.getElementById("character-preset-div").classList.toggle("no-background");
            $("body").toggleClass("no-background-body");
            $("body").toggleClass("fancy-body");

            document.getElementById("simple-or-fancy-text").innerHTML = "[Let's Make it Fancy]";
            document.getElementById("simple-or-fancy-text").href = "#fancy";

            document.getElementById("sub-title").innerHTML = "Quest Helper<br><br><span style='font-family: \"Arial\", serif; font-weight: bold; letter-spacing: 1px !important; color: aliceblue; text-shadow: 1px 1px 1px #000000 !important;'>Simple Mode</span>";
        }
        else
        {
            document.getElementById("simple-or-fancy-text").innerHTML = "[Let's Keep it Simple]";
            document.getElementById("simple-or-fancy-text").href = "#simple";
        }
    }
    else
    {
        document.getElementById("simple-or-fancy-text").innerHTML = "[Let's Keep it Simple]";
        document.getElementById("simple-or-fancy-text").href = "#simple";
    }
}

function save_cookie()
{
    /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */

    let settings_map = new Map();
    settings_map.quest_shown_value = quest_shown_value;
    settings_map.ascending_sort_quest_list = ascending_sort_quest_list;
    settings_map.ascending_sort_quest_score = ascending_sort_quest_score;
    settings_map.hide_quest_score = hide_quest_score;
    settings_map.min_quest_chapter = min_quest_chapter;
    settings_map.max_quest_chapter = max_quest_chapter;
    settings_map.quest_filter = quest_filter;
    settings_map.item_amount_per_row = item_amount_per_row;

    let encrypted_setting_map = JSON.stringify(settings_map);
    console.log(encrypted_setting_map);
    localStorage.setItem('settings', encrypted_setting_map);

    toastr.success("Your settings have been saved!");
    console.log("[Settings] - Cookie has been baked.");
}

function delete_cookie()
{
    if (is_cookies_exist())
    {
        /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */
        localStorage.removeItem('settings');

        toastr.success("Your saved settings have been deleted.");
        console.log("[Settings] - Cookie has been eaten.");
    }
    else
    {
        toastr.error("You did not save any settings.");
    }
}

function read_cookie()
{
    /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */
    if (is_cookies_exist())
    {
        set_values_from_cookie();

        document.getElementById("quest-shown-amt").value = quest_shown_value;
        check_checkbox("sort-ascending-quest-list", ascending_sort_quest_list);
        check_checkbox("sort-ascending-quest-score", ascending_sort_quest_score);
        check_checkbox("hide-quest-score", hide_quest_score);
        document.getElementById("min-quest-chapter").value = min_quest_chapter;
        document.getElementById("max-quest-chapter").value = max_quest_chapter;
        if (quest_filter === "filter-all")
        {
            check_checkbox("filter-all-quests", true);
            check_checkbox("filter-normal-quests", false);
            check_checkbox("filter-hard-quests", false);
        }
        else if (quest_filter === "filter-normal")
        {
            check_checkbox("filter-all-quests", false);
            check_checkbox("filter-normal-quests", true);
            check_checkbox("filter-hard-quests", false);
        }
        else if (quest_filter === "filter-hard")
        {
            check_checkbox("filter-all-quests", false);
            check_checkbox("filter-normal-quests", false);
            check_checkbox("filter-hard-quests", true);
        }
        document.getElementById("item-amount-per-row").value = item_amount_per_row;

        console.log("[Settings] Cookie settings have been loaded.");
    }
}

function set_settings_to_default()
{
    /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */
    quest_shown_value = quest_shown_value_default;
    ascending_sort_quest_list = ascending_sort_quest_list_default;
    ascending_sort_quest_score = ascending_sort_quest_score_default;
    hide_quest_score = hide_quest_score_default;
    min_quest_chapter = min_quest_chapter_default;
    max_quest_chapter = max_quest_chapter_default;
    quest_filter = quest_filter_default;
    item_amount_per_row = item_amount_per_row_default;
}

function reset_settings()
{
    /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */
    if (is_cookies_exist())
    {
        // SET COOKIE VALUES
        set_values_from_cookie();
    }
    else
    {
        // SET SYSTEM DEFAULTS
        set_settings_to_default();
    }

    document.getElementById("quest-shown-amt").value = quest_shown_value;
    check_checkbox("sort-ascending-quest-list", ascending_sort_quest_list);
    check_checkbox("sort-ascending-quest-score", ascending_sort_quest_score);
    check_checkbox("hide-quest-score", hide_quest_score);
    document.getElementById("min-quest-chapter").value = min_quest_chapter;
    document.getElementById("max-quest-chapter").value = max_quest_chapter;
    if (quest_filter === "filter-all")
    {
        check_checkbox("filter-all-quests", true);
        check_checkbox("filter-normal-quests", false);
        check_checkbox("filter-hard-quests", false);
    }
    else if (quest_filter === "filter-normal")
    {
        check_checkbox("filter-all-quests", false);
        check_checkbox("filter-normal-quests", true);
        check_checkbox("filter-hard-quests", false);
    }
    else if (quest_filter === "filter-hard")
    {
        check_checkbox("filter-all-quests", false);
        check_checkbox("filter-normal-quests", false);
        check_checkbox("filter-hard-quests", true);
    }
    document.getElementById("item-amount-per-row").value = item_amount_per_row;

    toastr.success("Settings have been reset.");
    refresh_quest_table();
}

function read_settings()
{
    /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */
    if (is_cookies_exist())
    {
        let saved_settings = JSON.parse(localStorage.getItem("settings"));
        let dump = JSON.stringify(saved_settings, null, 4);
        alert(dump);
    }
    else
    {
        toastr.error("You did not save any settings.");
    }
}

function set_values_from_cookie()
{
    /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */
    let settings_cookie_data = localStorage.getItem('settings');
    let saved_settings_map = JSON.parse(settings_cookie_data);

    if (jQuery.isEmptyObject(saved_settings_map))
    {
        // SETTINGS IS EMPTY, SET TO DEFAULT
        check_for_undefined_settings();
    }
    else
    {
        // VALUE CHECKING
        let max_value;
        let min_value;

        max_value = parseInt(document.getElementById("quest-shown-amt").max);
        min_value = parseInt(document.getElementById("quest-shown-amt").min);
        saved_settings_map.quest_shown_value = ((saved_settings_map.quest_shown_value > max_value) ? max_value : saved_settings_map.quest_shown_value);
        saved_settings_map.quest_shown_value = ((saved_settings_map.quest_shown_value < min_value) ? min_value : saved_settings_map.quest_shown_value);

        max_value = parseInt(document.getElementById("min-quest-chapter").max);
        min_value = parseInt(document.getElementById("min-quest-chapter").min);
        saved_settings_map.min_quest_chapter = ((saved_settings_map.min_quest_chapter > max_value) ? max_value : saved_settings_map.min_quest_chapter);
        saved_settings_map.min_quest_chapter = ((saved_settings_map.min_quest_chapter < min_value) ? min_value : saved_settings_map.min_quest_chapter);

        max_value = parseInt(document.getElementById("max-quest-chapter").max);
        min_value = parseInt(document.getElementById("max-quest-chapter").min);
        saved_settings_map.max_quest_chapter = ((saved_settings_map.max_quest_chapter > max_value) ? max_value : saved_settings_map.max_quest_chapter);
        saved_settings_map.max_quest_chapter = ((saved_settings_map.max_quest_chapter < min_value) ? min_value : saved_settings_map.max_quest_chapter);

        saved_settings_map.min_quest_chapter = ((saved_settings_map.min_quest_chapter > saved_settings_map.max_quest_chapter) ? saved_settings_map.max_quest_chapter : saved_settings_map.min_quest_chapter);

        max_value = parseInt(document.getElementById("item-amount-per-row").max);
        min_value = parseInt(document.getElementById("item-amount-per-row").min);
        saved_settings_map.item_amount_per_row = ((saved_settings_map.item_amount_per_row > max_value) ? max_value : saved_settings_map.item_amount_per_row);
        saved_settings_map.item_amount_per_row = ((saved_settings_map.item_amount_per_row < min_value) ? min_value : saved_settings_map.item_amount_per_row);

        quest_shown_value = saved_settings_map.quest_shown_value;
        ascending_sort_quest_list = saved_settings_map.ascending_sort_quest_list;
        ascending_sort_quest_score = saved_settings_map.ascending_sort_quest_score;
        hide_quest_score = saved_settings_map.hide_quest_score;
        min_quest_chapter = saved_settings_map.min_quest_chapter;
        max_quest_chapter = saved_settings_map.max_quest_chapter;
        quest_filter = saved_settings_map.quest_filter;
        item_amount_per_row = saved_settings_map.item_amount_per_row;

        // CHECK FOR ANY UNDEFINED SETTINGS
        check_for_undefined_settings();

        // SAVE SETTINGS
        let settings_map = new Map();
        settings_map.quest_shown_value = quest_shown_value;
        settings_map.ascending_sort_quest_list = ascending_sort_quest_list;
        settings_map.ascending_sort_quest_score = ascending_sort_quest_score;
        settings_map.hide_quest_score = hide_quest_score;
        settings_map.min_quest_chapter = min_quest_chapter;
        settings_map.max_quest_chapter = max_quest_chapter;
        settings_map.quest_filter = quest_filter;
        settings_map.item_amount_per_row = item_amount_per_row;
        let encrypted_setting_map = JSON.stringify(settings_map);
        localStorage.setItem('settings', encrypted_setting_map);
    }
}

function check_for_undefined_settings()
{
    /* TODO UPDATE WHENEVER A NEW SETTING IS ADDED */
    quest_shown_value = (quest_shown_value === undefined ? quest_shown_value_default : quest_shown_value);
    ascending_sort_quest_list = (ascending_sort_quest_list === undefined ? ascending_sort_quest_list_default : ascending_sort_quest_list);
    ascending_sort_quest_score = (ascending_sort_quest_score === undefined ? ascending_sort_quest_score_default : ascending_sort_quest_score);
    hide_quest_score = (hide_quest_score === undefined ? hide_quest_score_default : hide_quest_score);
    min_quest_chapter = (min_quest_chapter === undefined ? min_quest_chapter_default : min_quest_chapter);
    max_quest_chapter = (max_quest_chapter === undefined ? max_quest_chapter_default : max_quest_chapter);
    quest_filter = (quest_filter === undefined ? quest_filter_default : quest_filter);
    item_amount_per_row = (item_amount_per_row === undefined ? item_amount_per_row_default : item_amount_per_row);
}

function is_cookies_exist()
{
    return localStorage.getItem("settings") !== null;
}

function reload()
{
    window.location.reload(true);
}