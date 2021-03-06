let last_compiled_all_recipe_maps_array = [];
function build_recommended_quest_table(all_recipe_maps_array)
{
    last_compiled_all_recipe_maps_array = all_recipe_maps_array;
    let total_recipe = get_total_recipe(all_recipe_maps_array);
    let quest_table = document.getElementById("recommended-quest-table");
    let quests = quest_map;

    /* REPLACE TOTAL RECIPE WITH TOTAL RECIPE W/O DISABLED COMPONENTS FROM RECIPE READER/REQUIRED INGREDIENTS TABLE */
    for (let i = 0 ; i < disabled_items.length ; i++)
    {
        if (total_recipe.has(disabled_items[i]))
        {
            // DISABLED ITEM EXISTS IN TOTAL RECIPE, DELETE IT
            total_recipe.delete(disabled_items[i]);
        }
    }

    /* OPEN OR CLOSE QUEST BOARD */
    if (total_recipe.size > 0)
    {
        document.getElementById("recommended-quest-div").style.overflow = "hidden";

        /* ITERATE THROUGH ALL QUESTS, GENERATE QUEST SCORE */
        let quest_score_map = new Map();

        const item_is_in_top_2_score = 1;
        const item_is_in_3rd_slot = 0.75;
        const item_is_in_subitem_score = 0.5;

        for (let [quest_id, quest_data] of quests)
        {
            let split_quest_id = quest_id.split("-")[0];
            let quest_chapter_num = parseInt(split_quest_id);

            // CHECK IF QUEST CHAPTER IS WITHIN RANGE OF SETTINGS
            if (quest_chapter_num >= min_quest_chapter && quest_chapter_num <= max_quest_chapter)
            {
                // CHECK IF QUEST IS NORMAL/HARD IF SET TO CHECK
                let filter_exclude_quest = false;
                if (quest_filter === "filter-normal" || quest_filter === "filter-hard")
                {
                    if (quest_id.includes("H") && quest_filter === "filter-normal")
                    {
                        //  QUEST INCLUDES 'H' AND QUEST FILTER IS SET TO NORMAL, REMOVE QUEST
                        filter_exclude_quest = true;
                    }
                    else if (!quest_id.includes("H") && quest_filter === "filter-hard")
                    {
                        // QUEST DOESN'T INCLUDE 'H' AND QUEST FILTER IS SET TO HARD, REMOVE QUEST
                        filter_exclude_quest = true;
                    }
                }

                if (!filter_exclude_quest)
                {
                    let item_1_name = quest_data.get("item_1").item_name;       // OBJECT
                    let item_2_name = quest_data.get("item_2").item_name;       // OBJECT
                    let item_3_name = quest_data.get("item_3").item_name;       // OBJECT
                    let item_1_dp = quest_data.get("item_1").drop_percent;      // OBJECT
                    let item_3_dp = quest_data.get("item_3").drop_percent;      // OBJECT
                    let quest_subdrops = quest_data.get("subdrops");            // ARRAY
                    let char_shard = "";
                    if (quest_id.includes("H")) { char_shard = quest_data.get("char_shard").item_name; } // OBJECT

                    let quest_score = 0;

                    // CHECK ITEM 1 - 3
                    if (total_recipe.has(item_1_name)) { quest_score += item_is_in_top_2_score; }
                    if (total_recipe.has(item_2_name)) { quest_score += item_is_in_top_2_score; }
                    if (total_recipe.has(item_3_name))
                    {
                        // IF ITEM 3 DROP PERCENT == ITEM 1 DROP PERCENT, GIVE SCORE EQUAL AS IF ITEM WAS IN TOP 2
                        if (item_1_dp === item_3_dp)
                        {
                            quest_score += item_is_in_top_2_score;
                        }
                        else
                        {
                            quest_score += item_is_in_3rd_slot;
                        }

                    }

                    // CHECK SUBDROPS
                    for (let i = 0 ; i < quest_subdrops.length ; i++)
                    {
                        if (total_recipe.has(quest_subdrops[i])) { quest_score += item_is_in_subitem_score; }
                    }

                    // CHECK CHARACTER SHARD
                    if (total_recipe.has(char_shard)) { quest_score += item_is_in_top_2_score; }

                    // IF QUEST SCORE IS NOT ZERO, ADD TO QUEST TABLE
                    if (quest_score !== 0)
                    {
                        quest_score_map.set(quest_id, quest_score);
                    }
                }
            }
        }

        /* SORT */
        quest_score_map[Symbol.iterator] = function* ()
        {
            yield* [...this.entries()].sort(function (x, y)
            {
                // PARSE AND INIT DATA
                let x_quest_id = x[0];
                let x_quest_split = x_quest_id.split("-");
                let x_quest_chapter = x_quest_split[0];
                let x_quest_quest = x_quest_split[1];
                let x_quest_hard = 0;
                if (x_quest_quest.includes("H"))
                {
                    x_quest_quest.replace("H", "");
                    x_quest_hard = 1000;
                }
                let x_quest_value = (parseInt(x_quest_chapter) * 10000) + (parseInt(x_quest_quest) * 10) + x_quest_hard;

                let y_quest_id = y[0];
                let y_quest_split = y_quest_id.split("-");
                let y_quest_chapter = y_quest_split[0];
                let y_quest_quest = y_quest_split[1];
                let y_quest_hard = 0;
                if (y_quest_quest.includes("H"))
                {
                    y_quest_quest.replace("H", "");
                    y_quest_hard = 1000;
                }
                let y_quest_value = (parseInt(y_quest_chapter) * 10000) + (parseInt(y_quest_quest) * 10) + y_quest_hard;


                // SORTING CODE
                let n = (ascending_sort_quest_score ? sort_ascending(x[1], y[1]) : sort_descending(x[1], y[1]));
                if (n !== 0)
                {
                    return n;
                }

                return (ascending_sort_quest_list ? sort_ascending(x_quest_value, y_quest_value) : sort_descending(x_quest_value, y_quest_value));
            });
        };

        /* CONSTRUCT LIST */
        let table_html = "";

        let quest_count = 0;

        table_html += "<tbody>";

        if (quest_score_map.size > 0)
        {
            for (let [quest_id, quest_score] of quest_score_map)
            {
                let item_1 = get_quest_data(quest_id, "item_1");
                /** @namespace item_1.item_name */
                let item_1_name = item_1.item_name;
                /** @namespace item_1.drop_percent */
                let item_1_drop_percent = item_1.drop_percent;

                let item_2 = get_quest_data(quest_id, "item_2");
                /** @namespace item_2.item_name */
                let item_2_name = item_2.item_name;
                /** @namespace item_2.drop_percent */
                let item_2_drop_percent = item_2.drop_percent;

                let item_3 = get_quest_data(quest_id, "item_3");
                /** @namespace item_3.item_name */
                let item_3_name = item_3.item_name;
                /** @namespace item_3.drop_percent */
                let item_3_drop_percent = item_3.drop_percent;

                let subdrops = get_quest_data(quest_id, "subdrops");

                let character_shard = "";
                let char_shard_name = "";
                let char_shard_drop_rate = "";

                if (quest_id.includes("H"))
                {
                    character_shard = get_quest_data(quest_id, "char_shard");
                    char_shard_name = character_shard["item_name"];
                    char_shard_drop_rate = character_shard["drop_percent"];
                }

                // APPLY COLOR ACCORDING TO QUEST SCORE
                let quest_score_color = "";
                if (quest_score >= 2)
                {
                    quest_score_color = "quest-title-bg-green";
                }
                else if (quest_score >= 1)
                {
                    quest_score_color = "quest-title-bg-yellow";
                }
                else
                {
                    quest_score_color = "quest-title-bg-red";
                }

                table_html += "<tr>";

                // QUEST NAME
                table_html += "<th height='64' width='144'>" +
                    "<h3 class=\"quest-title " + quest_score_color + (quest_id.includes("H") ? " quest-title-hard" : "") + "\">" + quest_id.replace("H", " <span style=\"color: #ff4d4d\">H</span>") + "</h3>" +
                    "</th>";

                // DIVIDER
                table_html += "<th>";
                table_html += "<img class=\"quest-item-image quest-item-divider\" title=\""
                    + "\" src=\"\" alt=\"\">";
                // INCLUDE HARD MODE CHARACTER SHARD IMAGE
                if (quest_id.includes("H"))
                {
                    if (total_recipe.has(char_shard_name))
                    {
                        table_html += "<img class=\"quest-item-image quest-character-shard\" title=\"" + char_shard_name +
                            "\" src=\"images/items/" + (char_shard_name).split(' ').join('_') + ".png\" alt\"\">";
                        table_html += "<div class=\"quest-character-shard-drop-rate\">" + char_shard_drop_rate + "\u0025</div>";
                    }
                    else
                    {
                        table_html += "<img class=\"quest-item-image quest-character-shard-grayscale\" title=\"" + char_shard_name +
                            "\" src=\"images/items/" + (char_shard_name).split(' ').join('_') + ".png\" alt\"\">";
                    }

                }
                table_html += "</th>";

                // ITEM 1 IMAGE
                table_html += "<th class=\"quest-item-image\" height='48' width='48'>";
                table_html += "<img class=\"quest-item-image" + (total_recipe.has(item_1_name) ? "" : " grayscale") + "\" title=\"" + item_1_name
                    + "\" src=\"images/items/" + item_1_name.split(' ').join('_') + ".png\" alt=\"\">";
                table_html += "<div class=\"quest-percent-text\">" + item_1_drop_percent + "\u0025</div>";
                table_html += "</th>";

                // ITEM 2 IMAGE
                table_html += "<th class=\"quest-item-image\" height='48' width='48'>";
                table_html += "<img class=\"quest-item-image" + (total_recipe.has(item_2_name) ? "" : " grayscale") + "\" title=\"" + item_2_name
                    + "\" src=\"images/items/" + item_2_name.split(' ').join('_') + ".png\" alt=\"\">";
                table_html += "<div class=\"quest-percent-text\">" + item_2_drop_percent + "\u0025</div>";
                table_html += "</th>";

                // ITEM 3 IMAGE
                table_html += "<th class=\"quest-item-image\" height='48' width='48'>";
                table_html += "<img class=\"quest-item-image" + (total_recipe.has(item_3_name) ? "" : " grayscale") + "\" title=\"" + item_3_name
                    + "\" src=\"images/items/" + item_3_name.split(' ').join('_') + ".png\" alt=\"\">";
                table_html += "<div class=\"quest-percent-text\">" + item_3_drop_percent + "\u0025</div>";
                table_html += "</th>";

                // DIVIDER
                table_html += "<th>";
                table_html += "<img class=\"quest-item-image quest-item-divider\" title=\""
                    + "\" src=\"\" alt=\"\">";
                table_html += "</th>";

                // SUB-ITEM IMAGES
                for (let i = 0 ; i < subdrops.length ; i++)
                {
                    table_html += "<th class=\"quest-item-image\" height='48' width='48'>";
                    table_html += "<img class=\"quest-item-image" + (total_recipe.has(subdrops[i]) ? "" : " grayscale") + "\" title=\"" + ((subdrops[i] !== "") ? subdrops[i] : "???")
                        + "\" src=\"images/items/" + ((subdrops[i] !== "") ? subdrops[i].split(' ').join('_') : "Placeholder") + ".png\" alt=\"\">";
                    table_html += "<div class=\"quest-percent-text\">20\u0025</div>";
                    table_html += "</th>";
                }

                if (!hide_quest_score)
                {
                    // DIVIDER
                    table_html += "<th>";
                    table_html += "<img class=\"quest-item-image quest-item-divider\" title=\""
                        + "\" src=\"\" alt=\"\">";
                    table_html += "</th>";

                    // QUEST POINTS
                    table_html += "<th height='64' width='144'><h3 class=\"quest-title " + quest_score_color + "\">" + quest_score + " pts</h3></th>";
                }

                // END TABLE ROW
                table_html += "</tr>";



                quest_count++;

                if (quest_count >= quest_shown_value)
                {
                    break;
                }
            }
        }
        table_html += "</body>";

        quest_table.innerHTML = table_html;

        document.getElementById("recommended-quest-div").style.height = quest_table.scrollHeight + "px";
        setTimeout(function () {
            document.getElementById("recommended-quest-div").style.overflow = "auto";
        }, 400);
    }
    else
    {
        document.getElementById("recommended-quest-div").style.height = "0px";
        document.getElementById("recommended-quest-div").style.overflow = "hidden";
    }



}

function refresh_quest_table()
{
    if (last_compiled_all_recipe_maps_array.length > 0)
    {
        build_recommended_quest_table(last_compiled_all_recipe_maps_array);
    }
}