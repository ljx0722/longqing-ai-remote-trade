// src/catalog/major-ports.ts
var rows = [
  ["shanghai", "\u4E0A\u6D77", "\u957F\u6C5F\u53E3", 7, 121.47, 31.23, "china"],
  ["hong-kong", "\u9999\u6E2F", "\u73E0\u6C5F\u53E3\u4E1C\u5CB8", 9, 114.16, 22.28, "china"],
  ["xinan", "\u65B0\u5B89\uFF08\u6DF1\u5733\uFF09", "\u73E0\u6C5F\u53E3\u4E1C\u5CB8", 9, 113.93, 22.54, "china"],
  ["temasek", "\u6DE1\u9A6C\u9521\uFF08\u65B0\u52A0\u5761\uFF09", "\u9A6C\u6765\u534A\u5C9B\u5357\u7AEF", 7, 103.85, 1.29, "southeast"],
  ["oslo", "\u5965\u65AF\u9646", "\u5965\u65AF\u9646\u5CE1\u6E7E", 6, 10.75, 59.91, "baltic"],
  ["helsinki", "\u8D6B\u5C14\u8F9B\u57FA", "\u82AC\u5170\u6E7E", 9, 24.94, 60.17, "baltic"],
  ["st-petersburg", "\u5723\u5F7C\u5F97\u5821", "\u6D85\u74E6\u6CB3\u53E3", 10, 30.31, 59.94, "baltic"],
  ["rostock", "\u7F57\u65AF\u6258\u514B", "\u6CE2\u7F57\u7684\u6D77\u5357\u5CB8", 6, 12.1, 54.09, "baltic"],
  ["rotterdam", "\u9E7F\u7279\u4E39", "\u83B1\u8335\u6CB3\u53E3", 7, 4.48, 51.92, "atlantic"],
  ["le-havre", "\u52D2\u963F\u5F17\u5C14", "\u585E\u7EB3\u6CB3\u53E3", 8, 0.11, 49.49, "atlantic"],
  ["anfa", "\u5B89\u6CD5\uFF08\u5361\u8428\u5E03\u5170\u5361\uFF09", "\u6469\u6D1B\u54E5\u5927\u897F\u6D0B\u5CB8", 7, -7.62, 33.59, "atlantic"],
  ["goree", "\u6208\u96F7\u5C9B\uFF08\u8FBE\u5580\u5C14\uFF09", "\u585E\u5185\u52A0\u5C14\u6D77\u5CB8", 9, -17.4, 14.67, "atlantic"],
  ["lagos", "\u62C9\u5404\u65AF", "\u51E0\u5185\u4E9A\u6E7E", 8, 3.39, 6.45, "atlantic"],
  ["luanda", "\u7F57\u5B89\u8FBE", "\u5B89\u54E5\u62C9\u6D77\u5CB8", 9, 13.23, -8.81, "atlantic"],
  ["delagoa", "\u5FB7\u62C9\u6208\u963F\u6E7E\uFF08\u9A6C\u666E\u6258\uFF09", "\u975E\u6D32\u4E1C\u5357\u5CB8", 9, 32.59, -25.97, "indian"],
  [
    "toamasina",
    "\u5854\u9A6C\u5854\u592B\uFF08\u56FE\u963F\u9A6C\u897F\u7EB3\uFF09",
    "\u9A6C\u8FBE\u52A0\u65AF\u52A0\u4E1C\u5CB8",
    9,
    49.4,
    -18.15,
    "indian"
  ],
  ["kuwait", "\u79D1\u5A01\u7279", "\u6CE2\u65AF\u6E7E\u897F\u5317\u5CB8", 10, 47.98, 29.38, "gulf"],
  ["karachi", "\u5361\u62C9\u5947", "\u5370\u5EA6\u6CB3\u4E09\u89D2\u6D32\u897F\u90E8", 10, 67.01, 24.86, "indian"],
  ["bombay", "\u5B5F\u4E70", "\u5370\u5EA6\u897F\u5CB8", 9, 72.83, 18.93, "indian"],
  ["madras", "\u9A6C\u5FB7\u62C9\u65AF\uFF08\u91D1\u5948\uFF09", "\u5370\u5EA6\u4E1C\u5CB8", 9, 80.28, 13.08, "indian"],
  ["calcutta", "\u52A0\u5C14\u5404\u7B54", "\u6052\u6CB3\u4E09\u89D2\u6D32", 10, 88.36, 22.57, "indian"],
  ["dhaka", "\u8FBE\u5361", "\u6052\u6CB3\u4E09\u89D2\u6D32\u4E1C\u5317\u90E8", 9, 90.41, 23.81, "indian"],
  ["bangkok", "\u66FC\u8C37", "\u6E44\u5357\u6CB3\u53E3", 9, 100.5, 13.75, "southeast"],
  ["dagon", "\u5927\u5149\uFF08\u4EF0\u5149\uFF09", "\u4F0A\u6D1B\u74E6\u5E95\u6C5F\u4E09\u89D2\u6D32", 8, 96.16, 16.8, "southeast"]
];
var majorPorts = rows.map(
  ([id, name, region, era, lon, lat, basin]) => ({
    id,
    name,
    region,
    era,
    x: lon / 180,
    y: lat / 90,
    basin,
    polity: region,
    produces: ["grain", "pottery"],
    demands: ["iron", "linen"],
    danger: 0.18,
    type: [
      "shanghai",
      "rotterdam",
      "st-petersburg",
      "calcutta",
      "dhaka",
      "bangkok",
      "dagon"
    ].includes(id) ? "river" : id === "goree" ? "island" : "coastal",
    specialty: Math.abs(lat) > 40 ? "\u6728\u6750\u3001\u7CAE\u98DF\u4E0E\u624B\u5DE5\u4E1A" : "\u5730\u57DF\u7269\u4EA7\u4E0E\u6CBF\u5CB8\u96C6\u6563",
    climate: Math.abs(lat) > 40 ? "\u6E29\u5E26" : Math.abs(lat) < 24 ? "\u70ED\u5E26\u4E0E\u5B63\u98CE" : "\u4E9A\u70ED\u5E26"
  })
);

// src/catalog/ports.ts
var rows2 = [
  ["sidon", "\u897F\u987F", "\u9ECE\u51E1\u7279\u6D77\u5CB8", 35.37, 33.56, 1, "med", "dye glass cedar", "grain copper linen"],
  ["akka", "\u963F\u5361", "\u9ECE\u51E1\u7279\u6D77\u5CB8", 35.08, 32.92, 2, "med", "oil pottery", "grain copper tin"],
  ["jaffa", "\u96C5\u6CD5", "\u9ECE\u51E1\u7279\u6D77\u5CB8", 34.75, 32.05, 2, "med", "oil wine pottery", "cedar copper linen"],
  ["athens", "\u6BD4\u96F7\u57C3\u592B\u65AF", "\u963F\u63D0\u5361", 23.64, 37.94, 3, "med", "pottery oil wine", "grain tin cedar"],
  ["corinth", "\u79D1\u6797\u65AF", "\u79D1\u6797\u65AF\u6E7E", 22.92, 37.94, 3, "med", "pottery oil", "grain copper dye"],
  ["rhodes", "\u7F57\u5F97\u5C9B", "\u7231\u7434\u6D77", 28.22, 36.44, 3, "med", "wine oil pottery", "grain linen pepper", "island"],
  ["miletus", "\u7C73\u5229\u90FD", "\u5B89\u7EB3\u6258\u5229\u4E9A\u897F\u5CB8", 27.28, 37.53, 3, "med", "wine pottery", "grain tin linen"],
  ["ephesus", "\u4EE5\u5F17\u6240", "\u5B89\u7EB3\u6258\u5229\u4E9A\u897F\u5CB8", 27.34, 37.94, 3, "med", "pottery wine", "grain glass pepper"],
  ["smyrna", "\u58EB\u9EA6\u90A3", "\u5B89\u7EB3\u6258\u5229\u4E9A\u897F\u5CB8", 27.13, 38.43, 3, "med", "wine oil", "grain iron silk"],
  ["sinope", "\u9521\u8BFA\u666E", "\u9ED1\u6D77\u5357\u5CB8", 35.15, 42.02, 3, "blacksea", "iron grain", "oil wine pottery"],
  ["trebizond", "\u7279\u62C9\u5E03\u5B97", "\u9ED1\u6D77\u5357\u5CB8", 39.72, 41.01, 4, "blacksea", "iron silk", "salt glass oil"],
  ["chersonesus", "\u8D6B\u5C14\u677E\u5C3C\u7D22\u65AF", "\u514B\u91CC\u7C73\u4E9A\u534A\u5C9B", 33.49, 44.61, 3, "blacksea", "grain salt", "wine oil pottery"],
  ["caffa", "\u5361\u6CD5", "\u514B\u91CC\u7C73\u4E9A\u534A\u5C9B", 35.39, 45.03, 7, "blacksea", "grain salt", "silk glass pepper"],
  ["thessaloniki", "\u585E\u8428\u6D1B\u5C3C\u57FA", "\u7231\u7434\u6D77\u5317\u5CB8", 22.94, 40.63, 3, "med", "grain wine", "silk pepper glass"],
  ["syracuse", "\u9521\u62C9\u5E93\u8428", "\u897F\u897F\u91CC\u5C9B", 15.29, 37.07, 3, "med", "grain wine oil", "iron tin glass", "island"],
  ["palermo", "\u5DF4\u52D2\u83AB", "\u897F\u897F\u91CC\u5C9B", 13.36, 38.12, 3, "med", "grain oil salt", "iron linen pepper", "island"],
  ["messina", "\u58A8\u897F\u62FF", "\u897F\u897F\u91CC\u6D77\u5CE1", 15.55, 38.19, 3, "med", "wine salt", "grain silk iron", "island"],
  ["naples", "\u90A3\u4E0D\u52D2\u65AF", "\u610F\u5927\u5229\u5357\u5CB8", 14.27, 40.84, 3, "med", "wine pottery oil", "grain silk pepper"],
  ["brindisi", "\u5E03\u6797\u8FEA\u897F", "\u610F\u5927\u5229\u4E1C\u5CB8", 17.94, 40.64, 3, "med", "oil wine", "grain glass silk"],
  ["ravenna", "\u62C9\u6587\u7EB3", "\u4E9A\u5F97\u91CC\u4E9A\u6D77", 12.28, 44.48, 4, "med", "salt grain glass", "silk pepper cedar"],
  ["genoa", "\u70ED\u90A3\u4E9A", "\u5229\u53E4\u91CC\u4E9A\u6D77", 8.93, 44.41, 6, "med", "glass oil wine", "silk pepper grain"],
  ["pisa", "\u6BD4\u8428", "\u6258\u65AF\u5361\u7EB3\u6D77\u5CB8", 10.29, 43.68, 6, "med", "wine oil iron", "grain silk pepper"],
  ["ragusa", "\u62C9\u53E4\u8428", "\u8FBE\u5C14\u9A6C\u63D0\u4E9A\u6D77\u5CB8", 18.11, 42.64, 6, "med", "salt iron", "grain silk glass"],
  ["split", "\u65AF\u666E\u5229\u7279", "\u8FBE\u5C14\u9A6C\u63D0\u4E9A\u6D77\u5CB8", 16.44, 43.51, 4, "med", "wine oil salt", "grain silk pottery"],
  ["marseille", "\u9A6C\u8D5B", "\u666E\u7F57\u65FA\u65AF\u6D77\u5CB8", 5.37, 43.3, 3, "med", "wine oil salt", "grain tin pepper"],
  ["barcelona", "\u5DF4\u585E\u7F57\u90A3", "\u52A0\u6CF0\u7F57\u5C3C\u4E9A\u6D77\u5CB8", 2.18, 41.38, 6, "med", "wine oil iron", "silk pepper grain"],
  ["valencia", "\u74E6\u4F26\u897F\u4E9A", "\u4F0A\u6BD4\u5229\u4E9A\u4E1C\u5CB8", -0.32, 39.45, 6, "med", "pottery wine oil", "grain iron silk"],
  ["malaga", "\u9A6C\u62C9\u52A0", "\u5B89\u8FBE\u5362\u897F\u4E9A\u6D77\u5CB8", -4.42, 36.72, 3, "med", "wine oil salt", "grain iron linen"],
  ["ceuta", "\u4F11\u8FBE", "\u76F4\u5E03\u7F57\u9640\u6D77\u5CE1", -5.31, 35.9, 5, "med", "salt oil", "grain iron silk"],
  ["tangier", "\u4E39\u5409\u5C14", "\u6469\u6D1B\u54E5\u6D77\u5CB8", -5.81, 35.79, 3, "atlantic", "salt oil", "grain linen copper"],
  ["algiers", "\u963F\u5C14\u53CA\u5C14", "\u9A6C\u683C\u91CC\u5E03\u6D77\u5CB8", 3.06, 36.77, 6, "med", "grain oil", "iron linen glass"],
  ["tunis", "\u7A81\u5C3C\u65AF", "\u7A81\u5C3C\u65AF\u6E7E", 10.3, 36.8, 5, "med", "oil grain salt", "iron silk glass"],
  ["tripoli", "\u7684\u9ECE\u6CE2\u91CC", "\u5229\u6BD4\u4E9A\u6D77\u5CB8", 13.19, 32.89, 3, "med", "salt oil", "grain linen copper"],
  ["cyrene", "\u963F\u6CE2\u7F57\u5C3C\u4E9A", "\u6614\u5170\u5C3C\u52A0\u6D77\u5CB8", 21.97, 32.9, 3, "med", "grain wine", "oil iron pottery"],
  ["famagusta", "\u6CD5\u9A6C\u53E4\u65AF\u5854", "\u585E\u6D66\u8DEF\u65AF\u4E1C\u5CB8", 33.95, 35.12, 6, "med", "copper salt wine", "grain silk pepper", "island"],
  ["salamis", "\u8428\u62C9\u7C73\u65AF", "\u585E\u6D66\u8DEF\u65AF\u4E1C\u5CB8", 33.9, 35.18, 2, "med", "copper pottery", "grain tin linen", "island"],
  ["porto", "\u6CE2\u5C14\u56FE", "\u8461\u8404\u7259\u675C\u7F57\u6CB3\u53E3", -8.67, 41.15, 6, "atlantic", "wine salt", "iron grain silk"],
  ["seville", "\u585E\u7EF4\u5229\u4E9A", "\u74DC\u8FBE\u5C14\u57FA\u7EF4\u5C14\u6CB3", -6, 37.38, 8, "atlantic", "oil wine pottery", "silver sugar pepper", "river"],
  ["bordeaux", "\u6CE2\u5C14\u591A", "\u6CD5\u56FD\u52A0\u9F99\u6CB3\u53E3", -0.55, 44.84, 6, "atlantic", "wine salt", "iron linen pepper", "river"],
  ["nantes", "\u5357\u7279", "\u5362\u74E6\u5C14\u6CB3\u53E3", -1.55, 47.2, 6, "atlantic", "salt grain wine", "iron linen sugar", "river"],
  ["la-rochelle", "\u62C9\u7F57\u8C22\u5C14", "\u6BD4\u65AF\u5F00\u6E7E", -1.15, 46.16, 6, "atlantic", "salt wine", "grain iron linen"],
  ["bristol", "\u5E03\u91CC\u65AF\u6258\u5C14", "\u4E0D\u5217\u98A0\u897F\u5CB8", -2.6, 51.45, 6, "atlantic", "iron tin linen", "wine oil salt", "river"],
  ["plymouth", "\u666E\u5229\u8305\u65AF", "\u82F1\u5409\u5229\u6D77\u5CE1", -4.14, 50.37, 7, "atlantic", "tin salt", "wine oil linen"],
  ["dublin", "\u90FD\u67CF\u6797", "\u7231\u5C14\u5170\u6D77", -6.24, 53.35, 5, "atlantic", "linen grain", "wine salt iron", "river"],
  ["edinburgh", "\u5229\u65AF", "\u82CF\u683C\u5170\u798F\u65AF\u6E7E", -3.17, 55.98, 6, "northsea", "linen salt", "wine iron grain"],
  ["bruges", "\u5E03\u9C81\u65E5", "\u4F5B\u5170\u5FB7\u65AF\u6D77\u5CB8", 3.2, 51.21, 6, "northsea", "linen glass", "wine grain pepper"],
  ["antwerp", "\u5B89\u7279\u536B\u666E", "\u65AF\u6D77\u5C14\u5FB7\u6CB3", 4.4, 51.22, 7, "northsea", "linen glass iron", "pepper sugar silver", "river"],
  ["hamburg", "\u6C49\u5821", "\u6613\u5317\u6CB3\u53E3", 9.97, 53.55, 6, "northsea", "grain iron linen", "wine salt pepper", "river"],
  ["bremen", "\u4E0D\u6765\u6885", "\u5A01\u6089\u6CB3\u53E3", 8.8, 53.08, 6, "northsea", "grain linen", "wine salt iron", "river"],
  ["bergen", "\u5351\u5C14\u6839", "\u632A\u5A01\u897F\u5CB8", 5.32, 60.4, 6, "northsea", "iron", "grain salt linen"],
  ["copenhagen", "\u54E5\u672C\u54C8\u6839", "\u5384\u52D2\u6D77\u5CE1", 12.6, 55.68, 6, "baltic", "grain salt", "wine iron linen"],
  ["lubeck", "\u5415\u8D1D\u514B", "\u6CE2\u7F57\u7684\u6D77\u5357\u5CB8", 10.7, 53.87, 6, "baltic", "salt grain", "wine linen pepper"],
  ["gdansk", "\u683C\u4F46\u65AF\u514B", "\u7EF4\u65AF\u74E6\u6CB3\u53E3", 18.65, 54.35, 6, "baltic", "grain linen", "wine salt iron"],
  ["riga", "\u91CC\u52A0", "\u9053\u52A0\u74E6\u6CB3\u53E3", 24.11, 56.95, 6, "baltic", "linen grain", "salt wine iron"],
  ["tallinn", "\u5854\u6797", "\u82AC\u5170\u6E7E\u5357\u5CB8", 24.75, 59.45, 6, "baltic", "grain linen", "salt wine glass"],
  ["stockholm", "\u65AF\u5FB7\u54E5\u5C14\u6469", "\u745E\u5178\u4E1C\u5CB8", 18.07, 59.33, 6, "baltic", "copper iron", "grain salt wine"],
  ["visby", "\u7EF4\u65AF\u6BD4", "\u54E5\u7279\u5170\u5C9B", 18.3, 57.64, 6, "baltic", "grain salt", "linen wine iron", "island"],
  ["novgorod", "\u8BFA\u592B\u54E5\u7F57\u5FB7", "\u6C83\u5C14\u970D\u592B\u6CB3\u5546\u8DEF", 31.28, 58.52, 6, "baltic", "linen grain", "salt wine iron", "river"],
  ["arwad", "\u963F\u5C14\u74E6\u5FB7", "\u9ECE\u51E1\u7279\u8FD1\u6D77", 35.86, 34.86, 1, "med", "cedar pottery salt", "grain copper tin", "island"],
  ["qana", "\u5361\u7EB3", "\u54C8\u5FB7\u62C9\u6BDB\u6D77\u5CB8", 48.33, 14.02, 3, "indian", "salt", "grain linen glass"],
  ["jeddah", "\u5409\u8FBE", "\u7EA2\u6D77\u4E1C\u5CB8", 39.17, 21.49, 5, "redsea", "salt", "grain cotton pepper"],
  ["suakin", "\u8428\u74E6\u91D1", "\u7EA2\u6D77\u897F\u5CB8", 37.33, 19.11, 6, "redsea", "salt gems", "grain cotton glass"],
  ["massawa", "\u9A6C\u8428\u74E6", "\u5384\u7ACB\u7279\u91CC\u4E9A\u6D77\u5CB8", 39.46, 15.61, 5, "redsea", "salt gems", "grain cotton copper"],
  ["mocha", "\u6469\u5361", "\u4E5F\u95E8\u7EA2\u6D77\u5CB8", 43.25, 13.32, 8, "redsea", "coffee salt", "grain cotton porcelain"],
  ["muscat", "\u9A6C\u65AF\u5580\u7279", "\u963F\u66FC\u6D77\u5CB8", 58.59, 23.61, 5, "gulf", "copper salt", "grain cotton porcelain"],
  ["sohar", "\u82CF\u54C8\u5C14", "\u963F\u66FC\u6D77\u5CB8", 56.75, 24.36, 5, "gulf", "copper salt", "grain cotton pepper"],
  ["qishm", "\u683C\u4EC0\u59C6", "\u6CE2\u65AF\u6E7E\u6D77\u5CE1", 56.27, 26.95, 5, "gulf", "salt ivory-sub", "grain cotton iron", "island"],
  ["mogadishu", "\u6469\u52A0\u8FEA\u6C99", "\u7D22\u9A6C\u91CC\u6D77\u5CB8", 45.35, 2.04, 6, "indian", "cotton salt", "grain porcelain iron"],
  ["mombasa", "\u8499\u5DF4\u8428", "\u65AF\u74E6\u5E0C\u91CC\u6D77\u5CB8", 39.67, -4.05, 6, "indian", "salt gems", "cotton porcelain iron"],
  ["zanzibar", "\u6851\u7ED9\u5DF4\u5C14", "\u4E1C\u975E\u8FD1\u6D77", 39.2, -6.16, 6, "indian", "salt gems", "cotton porcelain iron", "island"],
  ["sofala", "\u7D22\u6CD5\u62C9", "\u83AB\u6851\u6BD4\u514B\u6D77\u5CB8", 34.73, -20.17, 6, "indian", "gems", "cotton iron porcelain"],
  ["mozambique", "\u83AB\u6851\u6BD4\u514B\u5C9B", "\u83AB\u6851\u6BD4\u514B\u6D77\u5CE1", 40.73, -15.04, 6, "indian", "salt gems", "cotton iron grain", "island"],
  ["cape-town", "\u5F00\u666E\u6566", "\u597D\u671B\u89D2", 18.42, -33.92, 9, "atlantic", "wine grain", "iron cotton tea"],
  ["elmina", "\u57C3\u5C14\u7C73\u7EB3", "\u51E0\u5185\u4E9A\u6E7E", -1.35, 5.08, 8, "westafrica", "gems", "cotton iron salt"],
  ["accra", "\u963F\u514B\u62C9", "\u51E0\u5185\u4E9A\u6E7E", -0.2, 5.55, 8, "westafrica", "gems", "cotton iron salt"],
  ["benin", "\u8D1D\u5B81\u6CB3\u6E2F", "\u8D1D\u5B81\u6E7E", 5.32, 5.67, 8, "westafrica", "pepper", "copper iron cotton", "river"],
  ["bonny", "\u90A6\u5C3C", "\u5C3C\u65E5\u5C14\u4E09\u89D2\u6D32", 7.15, 4.45, 8, "westafrica", "salt", "iron copper cotton"],
  ["arguin", "\u963F\u5C14\u91D1", "\u6BDB\u91CC\u5854\u5C3C\u4E9A\u6D77\u5CB8", -16.45, 20.6, 8, "westafrica", "salt", "grain cotton iron", "island"],
  ["ribeira-grande", "\u91CC\u8D1D\u62C9\u683C\u5170\u5FB7", "\u4F5B\u5F97\u89D2\u7FA4\u5C9B", -23.61, 14.92, 8, "atlantic", "salt sugar", "grain iron linen", "island"],
  ["funchal", "\u4E30\u6C99\u5C14", "\u9A6C\u5FB7\u62C9\u7FA4\u5C9B", -16.91, 32.65, 8, "atlantic", "wine sugar", "grain iron linen", "island"],
  ["las-palmas", "\u62C9\u65AF\u5E15\u5C14\u9A6C\u65AF", "\u52A0\u90A3\u5229\u7FA4\u5C9B", -15.41, 28.14, 8, "atlantic", "sugar wine", "grain iron linen", "island"],
  ["angra", "\u82F1\u96C4\u6E2F", "\u4E9A\u901F\u5C14\u7FA4\u5C9B", -27.22, 38.65, 8, "atlantic", "grain wine", "iron sugar linen", "island"],
  ["cambay", "\u574E\u8D1D", "\u53E4\u5409\u62C9\u7279\u6D77\u6E7E", 72.62, 22.3, 5, "indian", "cotton gems", "copper silver porcelain"],
  ["bharuch", "\u5A46\u9C81\u8FE6\u8F66", "\u7EB3\u5C14\u9ED8\u8FBE\u6CB3\u53E3", 72.98, 21.71, 3, "indian", "gems pepper", "copper wine glass"],
  ["chaul", "\u7ECD\u5C14", "\u5EB7\u574E\u6D77\u5CB8", 72.93, 18.55, 6, "indian", "cotton pepper", "copper silver porcelain"],
  ["cochin", "\u79D1\u94A6", "\u9A6C\u62C9\u5DF4\u5C14\u6D77\u5CB8", 76.27, 9.97, 7, "indian", "pepper cinnamon", "silver cotton porcelain"],
  ["quilon", "\u594E\u9686", "\u9A6C\u62C9\u5DF4\u5C14\u6D77\u5CB8", 76.59, 8.89, 5, "indian", "pepper cinnamon", "silver copper porcelain"],
  ["galle", "\u52A0\u52D2", "\u65AF\u91CC\u5170\u5361\u5357\u5CB8", 80.22, 6.03, 6, "indian", "cinnamon gems", "cotton iron porcelain", "island"],
  ["colombo", "\u79D1\u4F26\u5761", "\u65AF\u91CC\u5170\u5361\u897F\u5CB8", 79.84, 6.94, 6, "indian", "cinnamon gems", "cotton iron silver", "island"],
  ["masulipatnam", "\u9A6C\u82CF\u5229\u5E15\u7279\u5357", "\u79D1\u7F57\u66FC\u5FB7\u5C14\u6D77\u5CB8", 81.13, 16.17, 7, "indian", "cotton", "silver copper cloves"],
  ["nagapattinam", "\u7EB3\u52A0\u5E15\u8482\u5357", "\u6CF0\u7C73\u5C14\u6D77\u5CB8", 79.85, 10.77, 6, "indian", "cotton salt", "copper silver cloves"],
  ["pulicat", "\u666E\u5229\u5361\u7279", "\u79D1\u7F57\u66FC\u5FB7\u5C14\u6D77\u5CB8", 80.32, 13.42, 8, "indian", "cotton", "silver copper pepper"],
  ["satgaon", "\u8428\u7279\u5188", "\u5B5F\u52A0\u62C9\u4E09\u89D2\u6D32", 88.4, 22.98, 6, "indian", "cotton grain", "copper silver spices", "river"],
  ["chittagong", "\u5409\u5927\u6E2F", "\u5B5F\u52A0\u62C9\u6E7E\u4E1C\u5317\u5CB8", 91.8, 22.33, 6, "indian", "cotton grain", "copper silver porcelain"],
  ["pegu", "\u52C3\u56FA", "\u4F0A\u6D1B\u74E6\u5E95\u6C5F\u53E3\u5546\u8DEF", 96.48, 17.33, 6, "southeast", "gems grain", "cotton silver porcelain", "river"],
  ["martaban", "\u9A6C\u8FBE\u73ED", "\u7F05\u7538\u5357\u5CB8", 97.6, 16.53, 7, "southeast", "pottery grain", "cotton silver pepper"],
  ["tenasserim", "\u4E39\u90A3\u6C99\u6797", "\u9A6C\u6765\u534A\u5C9B\u897F\u5CB8", 98.4, 12.08, 7, "southeast", "tin pepper", "cotton silver porcelain"],
  ["kedah", "\u5409\u6253", "\u9A6C\u6765\u534A\u5C9B\u897F\u5CB8", 100.32, 5.69, 5, "southeast", "tin pepper", "cotton silk porcelain"],
  ["aceh", "\u4E9A\u9F50", "\u82CF\u95E8\u7B54\u814A\u5317\u5CB8", 95.32, 5.56, 8, "southeast", "pepper", "cotton silver porcelain"],
  ["barus", "\u5DF4\u9C81\u65AF", "\u82CF\u95E8\u7B54\u814A\u897F\u5CB8", 98.4, 2.02, 5, "southeast", "pepper", "cotton copper porcelain"],
  ["banten", "\u4E07\u4E39", "\u722A\u54C7\u5C9B\u897F\u5CB8", 106.16, -6.04, 8, "southeast", "pepper sugar", "silver cotton porcelain"],
  ["gresik", "\u683C\u96F7\u897F\u514B", "\u722A\u54C7\u5C9B\u5317\u5CB8", 112.65, -7.16, 7, "southeast", "grain salt", "cotton copper porcelain"],
  ["makassar", "\u671B\u52A0\u9521", "\u82CF\u62C9\u5A01\u897F\u5357\u5CB8", 119.41, -5.14, 8, "southeast", "grain cloves", "cotton silver porcelain"],
  ["ternate", "\u7279\u5C14\u7EB3\u7279", "\u9A6C\u9C81\u53E4\u7FA4\u5C9B", 127.38, 0.79, 7, "southeast", "cloves", "grain iron cotton", "island"],
  ["banda", "\u73ED\u8FBE", "\u73ED\u8FBE\u7FA4\u5C9B", 129.9, -4.52, 7, "southeast", "nutmeg", "grain iron cotton", "island"],
  ["hoi-an", "\u4F1A\u5B89", "\u8D8A\u5357\u4E2D\u90E8\u6D77\u5CB8", 108.34, 15.88, 8, "southeast", "silk sugar", "copper silver porcelain"],
  ["ayutthaya", "\u963F\u745C\u9640\u8036", "\u6E44\u5357\u6CB3\u5546\u8DEF", 100.57, 14.36, 7, "southeast", "grain sugar", "copper silver silk", "river"],
  ["pattani", "\u5317\u5927\u5E74", "\u6CF0\u56FD\u6E7E", 101.25, 6.87, 8, "southeast", "tin pepper", "cotton silver porcelain"],
  ["brunei", "\u6587\u83B1", "\u5A46\u7F57\u6D32\u5317\u5CB8", 114.96, 4.89, 7, "southeast", "pepper", "cotton copper porcelain"],
  ["ningbo", "\u660E\u5DDE", "\u6D59\u6C5F\u6CBF\u6D77", 121.55, 29.87, 5, "china", "silk tea porcelain", "pepper silver gems"],
  ["hangzhou", "\u676D\u5DDE", "\u94B1\u5858\u6C5F\u5546\u8DEF", 120.19, 30.24, 6, "china", "silk tea porcelain", "pepper silver cloves", "river"],
  ["yangzhou", "\u626C\u5DDE", "\u957F\u6C5F\u4E0E\u8FD0\u6CB3", 119.43, 32.39, 5, "china", "silk salt", "pepper gems copper", "river"],
  ["fuzhou", "\u798F\u5DDE", "\u798F\u5EFA\u95FD\u6C5F\u53E3", 119.45, 26, 6, "china", "tea porcelain", "silver pepper cloves"],
  ["dengzhou", "\u767B\u5DDE", "\u5C71\u4E1C\u534A\u5C9B", 120.75, 37.81, 5, "china", "silk salt", "gems pepper copper"],
  ["nanjing", "\u5357\u4EAC", "\u957F\u6C5F\u4E0B\u6E38", 118.76, 32.08, 7, "china", "silk porcelain paper", "silver pepper cloves", "river"],
  ["macao", "\u6FB3\u95E8", "\u73E0\u6C5F\u53E3", 113.55, 22.19, 8, "china", "silk porcelain tea", "silver pepper cotton"],
  ["tamsui", "\u6DE1\u6C34", "\u53F0\u6E7E\u5317\u5CB8", 121.44, 25.17, 9, "china", "sugar grain", "iron cotton porcelain"],
  ["busan", "\u91DC\u5C71", "\u671D\u9C9C\u534A\u5C9B\u5357\u5CB8", 129.04, 35.1, 7, "japan", "paper pottery", "copper silk pepper"],
  ["hakata", "\u535A\u591A", "\u65E5\u672C\u4E5D\u5DDE\u5317\u5CB8", 130.4, 33.6, 6, "japan", "copper salt", "silk porcelain tea"],
  ["sakai", "\u583A", "\u65E5\u672C\u5927\u962A\u6E7E", 135.46, 34.57, 7, "japan", "iron copper", "silk porcelain pepper"],
  ["nagasaki", "\u957F\u5D0E", "\u65E5\u672C\u4E5D\u5DDE\u897F\u5CB8", 129.87, 32.75, 8, "japan", "silver copper", "silk sugar porcelain"],
  ["naha", "\u90A3\u9738", "\u7409\u7403\u7FA4\u5C9B", 127.67, 26.21, 7, "japan", "salt sugar", "silk porcelain iron", "island"],
  ["acapulco", "\u963F\u5361\u666E\u5C14\u79D1", "\u58A8\u897F\u54E5\u592A\u5E73\u6D0B\u5CB8", -99.88, 16.85, 8, "pacific", "silver cocoa", "silk porcelain iron"],
  ["cartagena", "\u5361\u5854\u8D6B\u7EB3", "\u52A0\u52D2\u6BD4\u6D77\u5357\u5CB8", -75.55, 10.4, 8, "caribbean", "cocoa tobacco", "iron linen wine"],
  ["portobelo", "\u8D1D\u6D1B\u6E2F", "\u5DF4\u62FF\u9A6C\u52A0\u52D2\u6BD4\u5CB8", -79.65, 9.55, 8, "caribbean", "silver cocoa", "iron linen wine"],
  ["panama", "\u5DF4\u62FF\u9A6C\u57CE", "\u5DF4\u62FF\u9A6C\u592A\u5E73\u6D0B\u5CB8", -79.5, 8.96, 8, "pacific", "silver cocoa", "iron linen wine"],
  ["callao", "\u5361\u4E9A\u4FC4", "\u79D8\u9C81\u6D77\u5CB8", -77.15, -12.06, 8, "pacific", "silver", "iron wine silk"],
  ["guayaquil", "\u74DC\u4E9A\u57FA\u5C14", "\u5384\u74DC\u591A\u5C14\u6D77\u5CB8", -79.88, -2.19, 8, "pacific", "cocoa", "iron wine cotton"],
  ["valparaiso", "\u74E6\u5C14\u5E15\u83B1\u7D22", "\u667A\u5229\u6D77\u5CB8", -71.62, -33.04, 8, "pacific", "wine grain copper", "iron silk sugar"],
  ["salvador", "\u8428\u5C14\u74E6\u591A", "\u5DF4\u897F\u4E1C\u5317\u6D77\u5CB8", -38.52, -12.97, 8, "atlantic-americas", "sugar tobacco", "iron linen wine"],
  ["recife", "\u7D2F\u897F\u8153", "\u5DF4\u897F\u4E1C\u5317\u6D77\u5CB8", -34.87, -8.06, 8, "atlantic-americas", "sugar", "iron linen wine"],
  ["rio", "\u91CC\u7EA6\u70ED\u5185\u5362", "\u5DF4\u897F\u4E1C\u5357\u6D77\u5CB8", -43.17, -22.9, 8, "atlantic-americas", "sugar", "iron linen wine"],
  ["buenos-aires", "\u5E03\u5B9C\u8BFA\u65AF\u827E\u5229\u65AF", "\u62C9\u666E\u62C9\u5854\u6CB3\u53E3", -58.36, -34.61, 8, "atlantic-americas", "grain silver", "iron linen wine"],
  ["san-juan", "\u5723\u80E1\u5B89", "\u6CE2\u591A\u9ECE\u5404", -66.12, 18.47, 8, "caribbean", "sugar tobacco", "iron linen wine", "island"],
  ["bridgetown", "\u5E03\u91CC\u5947\u6566", "\u5DF4\u5DF4\u591A\u65AF", -59.62, 13.1, 9, "caribbean", "sugar", "iron linen grain", "island"],
  ["port-royal", "\u7687\u5BB6\u6E2F", "\u7259\u4E70\u52A0", -76.84, 17.94, 9, "caribbean", "sugar cocoa", "iron linen wine", "island"],
  ["willemstad", "\u5A01\u5EC9\u65AF\u5854\u5FB7", "\u5E93\u62C9\u7D22\u5C9B", -68.94, 12.11, 9, "caribbean", "salt", "grain linen iron", "island"],
  ["boston", "\u6CE2\u58EB\u987F", "\u65B0\u82F1\u683C\u5170\u6D77\u5CB8", -71.05, 42.35, 9, "atlantic-americas", "iron grain", "sugar wine linen"],
  ["new-amsterdam", "\u65B0\u963F\u59C6\u65AF\u7279\u4E39", "\u54C8\u5F97\u5B59\u6CB3\u53E3", -74.01, 40.7, 9, "atlantic-americas", "grain", "sugar wine linen"],
  ["quebec", "\u9B41\u5317\u514B", "\u5723\u52B3\u4F26\u65AF\u6CB3", -71.2, 46.81, 9, "atlantic-americas", "grain", "iron wine linen", "river"],
  ["st-johns", "\u5723\u7EA6\u7FF0\u65AF", "\u7EBD\u82AC\u5170\u5C9B", -52.71, 47.56, 8, "atlantic-americas", "salt", "grain iron linen", "island"]
];
var climateFor = (latitude, basin) => {
  if (basin === "med") return "\u5730\u4E2D\u6D77\u6C14\u5019";
  if (["gulf", "redsea"].includes(basin)) return "\u5E72\u65F1\u6D77\u5CB8";
  if (["indian", "southeast", "china"].includes(basin) && Math.abs(latitude) < 30) return "\u5B63\u98CE\u6D77\u5CB8";
  if (Math.abs(latitude) < 23.5) return "\u70ED\u5E26\u6D77\u5CB8";
  if (Math.abs(latitude) > 55) return "\u5BD2\u6E29\u5E26\u6D77\u5CB8";
  return "\u6E29\u5E26\u6D77\u5CB8";
};
var extendedPorts = rows2.map(([id, name, region, lon, lat, era, basin, produces, demands, type]) => ({
  id,
  name,
  polity: `${region}\u5546\u4EBA`,
  region,
  x: lon / 180,
  y: lat / 90,
  era,
  basin,
  produces: produces.split(" "),
  demands: demands.replace("spices", "pepper").split(" "),
  danger: ["caribbean", "southeast", "westafrica"].includes(basin) ? 0.26 : 0.18,
  climate: climateFor(lat, basin),
  specialty: region,
  type: type || "coastal"
}));

// src/catalog/goods.ts
var rows3 = [
  ["inland-east-metals", "\u91D1\u5C5E", 5, 110, "iron", "dengzhou yangzhou ningbo guangzhou", "\u664B\u5317\u78C1\u94C1\u77FF|\u592A\u884C\u8D64\u94C1\u77FF|\u4E2D\u539F\u719F\u94C1\u6761|\u6CB3\u4E1C\u751F\u94C1\u5757|\u6E58\u6C5F\u9530\u77FF\u77F3|\u8D63\u5357\u9521\u7802|\u4E91\u5357\u9521\u7C92|\u6EC7\u4E2D\u94DC\u952D|\u8700\u5730\u9752\u94DC\u576F|\u5CAD\u5317\u94C5\u952D|\u534E\u5317\u950C\u77FF\u77F3|\u5C71\u4E1C\u786B\u94C1\u77FF|\u6E56\u5317\u5B54\u96C0\u77F3|\u6C5F\u6DEE\u94DC\u94B1\u576F|\u6E58\u897F\u6731\u7802\u77FF|\u8FBD\u4E1C\u94C1\u7802|\u7696\u5357\u94C1\u677F|\u6842\u5317\u94DC\u77FF\u7802|\u6CB3\u5357\u953B\u94C1\u7247|\u592A\u539F\u94A2\u5200\u576F"],
  ["inland-east-crafts", "\u624B\u5DE5\u5668\u5177", 7, 138, "merchant", "yangzhou hangzhou ningbo fuzhou guangzhou", "\u82CF\u5DDE\u7AF9\u523B\u7B14\u7B52|\u5317\u4EAC\u666F\u6CF0\u84DD\u5C0F\u76D2|\u5357\u4EAC\u4E91\u9526\u5E26|\u6210\u90FD\u8700\u7EE3\u5E15|\u592A\u539F\u94DC\u7089|\u6D1B\u9633\u94DC\u955C\u576F|\u5F00\u5C01\u6728\u7248\u753B|\u676D\u5DDE\u7EE2\u6247\u9762|\u626C\u5DDE\u6F06\u7802\u781A|\u5FBD\u5DDE\u96D5\u7248|\u6B59\u53BF\u7F57\u76D8\u576F|\u666F\u5FB7\u9547\u74F7\u781A|\u6CC9\u5DDE\u6728\u5076\u5934|\u5E7F\u5DDE\u725B\u89D2\u68B3|\u6842\u6797\u7AF9\u7F16\u7B3C|\u5927\u7406\u77F3\u781A\u5C4F|\u4E91\u5357\u94F6\u7C2A\u576F|\u957F\u6C99\u77F3\u5370\u7AE0|\u6D4E\u5357\u77F3\u78E8\u76D8|\u6C7E\u6CB3\u76AE\u9F13"],
  ["inland-east-herbs", "\u8349\u6728\u7269\u4EA7", 6, 79, "garden", "guangzhou yangzhou ningbo fuzhou", "\u4EB3\u5DDE\u767D\u828D\u5E72|\u6000\u5E86\u5C71\u836F\u7247|\u9647\u897F\u9EC4\u82AA\u6839|\u5929\u6C34\u5F53\u5F52\u7247|\u5B81\u590F\u67B8\u675E\u5E72|\u9752\u6D77\u5927\u9EC4\u6839|\u8700\u5730\u9EC4\u8FDE\u6839|\u6EC7\u5357\u4E09\u4E03\u6839|\u6D59\u5730\u676D\u83CA\u5E72|\u6C5F\u5357\u6851\u53F6\u5305|\u6842\u6797\u7F57\u6C49\u679C|\u957F\u6C99\u6800\u5B50\u5E72|\u592A\u884C\u8FDE\u7FD8\u58F3|\u4E1C\u5317\u4E94\u5473\u5B50|\u7518\u8083\u7518\u8349\u6839|\u5C71\u897F\u515A\u53C2\u6839|\u56DB\u5DDD\u5DDD\u828E\u5757|\u6E56\u5317\u539A\u6734\u76AE|\u7696\u5357\u6728\u74DC\u7247|\u6B66\u5937\u4E4C\u6885\u5E72"],
  ["inland-steppe", "\u8349\u539F\u7269\u4EA7", 6, 122, "wool", "sinope trebizond siraf hormuz", "\u6492\u9A6C\u5C14\u7F55\u7F8A\u6BDB\u6BEF|\u5E03\u54C8\u62C9\u68C9\u7EE3\u7247|\u5854\u4EC0\u5E72\u68C9\u7C7D|\u5580\u4EC0\u8461\u8404\u5E72\u997C|\u548C\u7530\u7389\u7C7D\u6599|\u5410\u9C81\u756A\u8461\u8404\u918B|\u6CB3\u897F\u9A7C\u6BDB\u7EBF|\u5DF4\u5C14\u8D6B\u7F8A\u7ED2\u675F|\u8D6B\u62C9\u7279\u5730\u6BEF\u576F|\u547C\u7F57\u73CA\u85CF\u7EA2\u82B1\u4E1D|\u8D39\u5C14\u5E72\u7EB3\u674F\u4EC1|\u5E15\u7C73\u5C14\u5C71\u7F8A\u7ED2|\u4F0A\u7281\u8702\u871C\u9676\u7F50|\u5854\u91CC\u6728\u80E1\u6768\u677F|\u4E2D\u4E9A\u978D\u6BEF|\u8349\u539F\u76AE\u6C34\u56CA|\u9A7C\u94C3\u94DC\u576F|\u6BE1\u623F\u6BDB\u6BE1\u7247|\u91CC\u6D77\u9C9F\u9C7C\u80F6|\u4E1D\u8DEF\u8334\u9999\u5305"],
  ["inland-india-crafts", "\u624B\u5DE5\u5668\u5177", 8, 145, "merchant", "surat cambay bharuch masulipatnam pulicat", "\u62C9\u5408\u5C14\u94DC\u58F6|\u963F\u683C\u62C9\u77F3\u5D4C\u7247|\u74E6\u62C9\u7EB3\u897F\u9526\u7F0E\u5E26|\u658B\u6D66\u5C14\u523B\u82B1\u77F3\u7897|\u5FB7\u91CC\u76AE\u9774\u576F|\u6D77\u5F97\u62C9\u5DF4\u94F6\u7EBF|\u6BD4\u8D3E\u5E03\u5C14\u9EC4\u94DC\u76D8|\u8FC8\u7D22\u5C14\u6A80\u6728\u68B3|\u5766\u8D3E\u6B66\u5C14\u94DC\u706F|\u574E\u5951\u4E1D\u7EF8\u8170\u5E26|\u514B\u4EC0\u7C73\u5C14\u6728\u96D5\u76D2|\u6728\u5C14\u5766\u5F69\u9676\u7816|\u53E4\u5409\u62C9\u7279\u6728\u5370\u6A21|\u5FB7\u5E72\u94C1\u5236\u519C\u9504|\u9A6C\u5C14\u74E6\u68C9\u7EB1\u7EDE|\u65C1\u906E\u666E\u76AE\u978D\u5305|\u62C9\u8D3E\u65AF\u5766\u975B\u997C|\u6052\u6CB3\u8D1D\u956F\u576F|\u52A0\u5FB7\u6EE1\u90FD\u94DC\u4F5B\u706F|\u5EB7\u63D0\u6F06\u6728\u5323"],
  ["inland-southeast", "\u6797\u5730\u7269\u4EA7", 8, 95, "forest", "pegu martaban hoi-an ayutthaya gresik banten", "\u84B2\u7518\u6F06\u7897\u576F|\u963F\u74E6\u67DA\u6728\u69AB|\u6E05\u8FC8\u94F6\u7897\u576F|\u7405\u52C3\u62C9\u90A6\u7AF9\u7EB8|\u4E07\u8C61\u5B89\u606F\u9999\u5757|\u5434\u54E5\u68D5\u53F6\u7EB8|\u91D1\u8FB9\u8695\u4E1D\u675F|\u987A\u5316\u6842\u6728\u7247|\u5347\u9F99\u7AF9\u6F06\u7B77|\u5609\u5B9A\u7C73\u7EB8\u7247|\u4E07\u9686\u7AF9\u5E2D\u5377|\u68AD\u7F57\u8721\u67D3\u5E03|\u722A\u54C7\u68D5\u6988\u7EA4\u7EF4\u7EF3|\u6E44\u516C\u6CB3\u85E4\u7BEE|\u5C71\u5730\u91CE\u8702\u5DE2\u8721|\u6CF0\u5317\u68C9\u7EC7\u62AB\u80A9|\u7F05\u5317\u8336\u7816|\u8D8A\u5317\u6F06\u6811\u8102|\u67EC\u57D4\u5BE8\u8C46\u853B\u5305|\u4E2D\u592E\u722A\u54C7\u6728\u9762\u5177"],
  ["inland-europe-stone", "\u77FF\u77F3\u4E0E\u5EFA\u6750", 6, 92, "iron", "venice genoa marseille hamburg antwerp", "\u5361\u62C9\u62C9\u96D5\u523B\u77F3\u576F|\u6258\u65AF\u5361\u7EB3\u7802\u5CA9\u677F|\u7EF4\u7F57\u7EB3\u7EA2\u77F3|\u6CE2\u5E0C\u7C73\u4E9A\u77F3\u69B4\u77F3\u576F|\u8428\u514B\u68EE\u94F6\u77FF\u7802|\u8482\u7F57\u5C14\u94DC\u77FF\u77F3|\u963F\u5C14\u5351\u65AF\u5CA9\u6676|\u5DF4\u4F10\u5229\u4E9A\u77F3\u7070\u5757|\u83B1\u8335\u677F\u5CA9\u74E6|\u6D1B\u6797\u94C1\u77FF\u7802|\u65BD\u74E6\u672C\u78E8\u5200\u77F3|\u5308\u7259\u5229\u94DC\u952D|\u6CE2\u5170\u77F3\u76D0\u7816|\u65AF\u6D1B\u4F10\u514B\u94F6\u7802|\u5A01\u5C14\u58EB\u84DD\u677F\u5CA9|\u7EA6\u514B\u78E8\u77F3|\u52C3\u826E\u7B2C\u77F3\u677F|\u963F\u767B\u9752\u77F3\u5757|\u5965\u5730\u5229\u6ED1\u77F3\u5757|\u897F\u73ED\u7259\u96EA\u82B1\u77F3\u818F"],
  ["inland-europe-crafts", "\u624B\u5DE5\u5668\u5177", 8, 174, "merchant", "antwerp hamburg venice genoa bordeaux bristol", "\u7EBD\u4F26\u5821\u94DC\u5C3A|\u5965\u683C\u65AF\u5821\u94F6\u676F\u576F|\u5E03\u62C9\u683C\u523B\u82B1\u73BB\u7483\u676F|\u7EF4\u4E5F\u7EB3\u76AE\u9769\u4E66\u5957|\u5DF4\u9ECE\u94DC\u7248|\u5170\u65AF\u7F8A\u6BDB\u62AB\u80A9|\u65AF\u7279\u62C9\u65AF\u5821\u5370\u5237\u5B57\u6A21|\u79D1\u9686\u9999\u8349\u888B|\u6CD5\u5170\u514B\u798F\u8D26\u7C3F|\u6155\u5C3C\u9ED1\u9521\u5236\u58F6|\u4F5B\u7F57\u4F26\u8428\u76AE\u5C01\u4E66|\u7C73\u5170\u9488\u7EC7\u624B\u5957|\u9A6C\u5FB7\u91CC\u76AE\u5E26\u576F|\u6258\u83B1\u591A\u5251\u67C4\u576F|\u683C\u62C9\u7EB3\u8FBE\u6728\u9576\u76D2|\u8428\u62C9\u66FC\u5361\u7F8A\u76AE\u5377|\u56FE\u5362\u5179\u67D3\u84DD\u7EBF|\u82CF\u9ECE\u4E16\u4E1D\u5E26|\u534E\u6C99\u8702\u8721\u70DB|\u514B\u62C9\u79D1\u592B\u94F6\u6263"],
  ["inland-west-africa", "\u975E\u6D32\u8179\u5730\u7269\u4EA7", 8, 125, "cotton", "elmina accra benin bonny arguin", "\u5EF7\u5DF4\u514B\u56FE\u68C9\u5E03\u5377|\u6770\u5185\u6CE5\u67D3\u5E03|\u52A0\u5965\u76AE\u978D\u888B|\u5361\u8BFA\u975B\u67D3\u957F\u5E03|\u5965\u7EA6\u7EC7\u5E26|\u963F\u6CE2\u7F8E\u94DC\u94C3|\u5E93\u9A6C\u897F\u91D1\u7B94\u576F|\u6492\u54C8\u62C9\u76D0\u77F3\u5757|\u8428\u8D6B\u52D2\u5C0F\u7C73\u888B|\u5C3C\u65E5\u5C14\u6CB3\u5E72\u9C7C\u6761|\u9A6C\u91CC\u4E73\u6728\u679C\u8102|\u8C6A\u8428\u76AE\u9774\u6599|\u7EA6\u9C81\u5DF4\u68D5\u7EA4\u7EF3|\u963F\u6563\u8482\u6728\u68B3|\u521A\u679C\u62C9\u83F2\u8349\u5E03|\u897F\u975E\u94C1\u9504\u576F|\u585E\u5185\u52A0\u5C14\u963F\u62C9\u4F2F\u6811\u80F6|\u51E0\u5185\u4E9A\u80E1\u6912\u7C7D|\u9A6C\u62C9\u5580\u4EC0\u76AE\u9769\u7247|\u975E\u65AF\u97A3\u76AE\u6599"],
  ["inland-east-africa", "\u975E\u6D32\u8179\u5730\u7269\u4EA7", 6, 108, "grain", "adulis massawa mogadishu sofala kilwa", "\u963F\u514B\u82CF\u59C6\u82D4\u9EB8|\u62C9\u5229\u8D1D\u62C9\u8702\u871C|\u8D21\u5FB7\u5C14\u68C9\u62AB\u80A9|\u54C8\u52D2\u5C14\u5496\u5561\u751F\u8C46|\u9AD8\u539F\u4E73\u9999\u6811\u8102|\u57C3\u585E\u4FC4\u6BD4\u4E9A\u76AE\u76FE\u576F|\u7EA2\u6D77\u8179\u5730\u5CA9\u76D0|\u4E1C\u975E\u5C71\u5730\u8702\u8721|\u6D25\u5DF4\u5E03\u97E6\u91D1\u7802|\u8D5E\u6BD4\u897F\u94DC\u7EBF|\u5185\u9646\u94C1\u77DB\u576F|\u9AD8\u5730\u77F3\u78E8\u576F|\u83AB\u8BFA\u83AB\u5854\u5E15\u68C9\u5E03|\u975E\u6D32\u9AD8\u539F\u9AD8\u7CB1|\u7D22\u6CD5\u62C9\u8179\u5730\u829D\u9EBB|\u65AF\u74E6\u5E0C\u91CC\u7F16\u5E2D|\u6CB3\u8C37\u846B\u82A6\u5BB9\u5668|\u4E1C\u975E\u9ED1\u6A80\u68B3|\u9AD8\u539F\u5C71\u7F8A\u76AE|\u5C71\u5730\u84D6\u9EBB\u7C7D"],
  ["inland-american-mines", "\u77FF\u77F3\u4E0E\u5EFA\u6750", 8, 188, "silver", "callao guayaquil veracruz acapulco rio", "\u6CE2\u6258\u897F\u94F6\u77FF\u7802|\u8428\u5361\u7279\u5361\u65AF\u94F6\u952D|\u5854\u65AF\u79D1\u94F6\u7247|\u74DC\u7EB3\u534E\u6258\u94F6\u7C92|\u5B89\u7B2C\u65AF\u94DC\u9524\u576F|\u62C9\u666E\u62C9\u5854\u94C5\u77FF\u5757|\u79D8\u9C81\u786B\u78FA\u6676|\u963F\u96F7\u57FA\u5E15\u706B\u5C71\u77F3|\u5E93\u65AF\u79D1\u77F3\u7070\u5757|\u58A8\u897F\u54E5\u9ED1\u66DC\u77F3\u7247|\u666E\u57C3\u5E03\u62C9\u9676\u571F|\u74E6\u54C8\u5361\u4E91\u6BCD\u7247|\u5DF4\u897F\u5C71\u5730\u6C34\u6676|\u7EF4\u62C9\u91CC\u5361\u91D1\u7802|\u7C73\u7EB3\u65AF\u94C1\u77FF\u77F3|\u667A\u5229\u94DC\u77FF\u77F3|\u73BB\u5229\u7EF4\u4E9A\u9521\u77FF\u7802|\u5384\u74DC\u591A\u5C14\u91D1\u7802|\u58A8\u897F\u54E5\u8D64\u94C1\u77FF\u989C\u6599|\u5B89\u7B2C\u65AF\u5B54\u96C0\u77F3\u576F"],
  ["inland-american-farms", "\u7F8E\u6D32\u8179\u5730\u7269\u4EA7", 8, 76, "grain", "callao guayaquil veracruz acapulco cartagena rio", "\u57FA\u591A\u85DC\u9EA6\u888B|\u6606\u5361\u7F8A\u6BDB\u6BEF|\u6CE2\u54E5\u5927\u68C9\u7EC7\u62AB\u80A9|\u5E93\u65AF\u79D1\u82CB\u7C7D\u997C|\u62C9\u5DF4\u65AF\u9A6C\u94C3\u85AF\u7C89|\u56FE\u5E93\u66FC\u7389\u7C73\u7C89|\u8428\u5C14\u5854\u5E72\u8FA3\u6912|\u4E9A\u677E\u68EE\u9A6C\u9EDB\u53F6|\u5723\u4FDD\u7F57\u6728\u85AF\u5E72|\u74E6\u54C8\u5361\u53EF\u53EF\u6D46\u5757|\u666E\u57C3\u5E03\u62C9\u7EA2\u8C46|\u74DC\u8FBE\u62C9\u54C8\u62C9\u9F99\u820C\u5170\u7EA4\u7EF4|\u5371\u5730\u9A6C\u62C9\u80ED\u8102\u866B\u5E72|\u5C24\u5361\u5766\u8702\u871C\u58F6|\u6885\u91CC\u8FBE\u5251\u9EBB\u675F|\u58A8\u897F\u54E5\u9999\u8349\u835A|\u5361\u5854\u6208\u53EF\u53EF\u8C46|\u5C3C\u52A0\u62C9\u74DC\u67D3\u6599\u6728\u7247|\u5317\u7F8E\u69ED\u7CD6\u997C|\u5723\u83F2\u978D\u76AE\u7247"],
  ["nile-grain", "\u7CAE\u98DF", 0, 17, "grain", "memphis alexandria", "\u57C3\u53CA\u4E8C\u7C92\u5C0F\u9EA6|\u5C3C\u7F57\u6CB3\u5927\u9EA6|\u6CB3\u8C37\u5C0F\u9EA6\u7C89|\u7C97\u78E8\u5927\u9EA6\u7C89|\u57C3\u53CA\u9EA6\u9EB8|\u53BB\u58F3\u4E8C\u7C92\u9EA6|\u65E5\u6652\u9EA6\u7C92|\u9EA6\u82BD\u7C92|\u70D8\u7119\u9EA6\u7C92|\u77F3\u78E8\u5168\u9EA6\u7C89|\u57C3\u53CA\u6241\u8C46|\u5C3C\u7F57\u6CB3\u8C4C\u8C46|\u5E72\u9E70\u5634\u8C46|\u8695\u8C46\u5E72|\u4E9A\u9EBB\u7C7D|\u7119\u70E4\u829D\u9EBB|\u829D\u9EBB\u7C7D|\u5E72\u65E0\u82B1\u679C"],
  ["river-food", "\u7CAE\u98DF", 0, 22, "grain", "ur dilmun basra", "\u4E24\u6CB3\u516D\u68F1\u5927\u9EA6|\u4E24\u6CB3\u9762\u7C89|\u5927\u9EA6\u788E\u7C92|\u6930\u67A3\u5E72|\u6930\u67A3\u818F|\u67A3\u6838\u9972\u6599|\u5E72\u8461\u8404\u4E32|\u829D\u9EBB\u997C\u7C95|\u829D\u9EBB\u6CB9|\u4E24\u6CB3\u5C0F\u6241\u8C46|\u82AB\u837D\u7C7D|\u5B5C\u7136\u7C7D|\u5E72\u6D0B\u8471|\u5E72\u849C\u74E3|\u82A5\u83DC\u7C7D|\u67A3\u6930\u53F6\u7BEE|\u6930\u67A3\u7CD6\u6D46|\u5E72\u77F3\u69B4\u76AE"],
  ["levant-food", "\u98DF\u54C1", 1, 31, "grain", "byblos sidon tyre akka jaffa", "\u9ECE\u51E1\u7279\u9E70\u5634\u8C46|\u9ECE\u51E1\u7279\u5E72\u8461\u8404|\u65E0\u82B1\u679C\u997C|\u5E72\u77F3\u69B4\u7C7D|\u814C\u6A44\u6984|\u6652\u5E72\u674F\u5B50|\u674F\u4EC1\u4EC1|\u963F\u52D2\u9887\u5F00\u5FC3\u679C|\u89D2\u8C46\u835A|\u89D2\u8C46\u7C89|\u77F3\u69B4\u6D53\u6C41|\u8461\u8404\u6D53\u6D46|\u6652\u5E72\u674E\u5B50|\u814C\u523A\u5C71\u67D1|\u5E72\u8584\u8377\u53F6|\u5E72\u767E\u91CC\u9999|\u70D8\u70E4\u829D\u9EBB\u9171|\u9E70\u5634\u8C46\u7C89"],
  ["med-grain", "\u7CAE\u98DF", 3, 23, "grain", "syracuse palermo carthage thessaloniki chersonesus", "\u897F\u897F\u91CC\u786C\u7C92\u9EA6|\u5317\u975E\u88F8\u7C92\u5C0F\u9EA6|\u8272\u96F7\u65AF\u5927\u9EA6|\u9ED1\u6D77\u5C0F\u9EA6|\u897F\u897F\u91CC\u7C97\u7C92\u9EA6\u7C89|\u610F\u5927\u5229\u9E70\u5634\u8C46|\u5730\u4E2D\u6D77\u8695\u8C46|\u9E70\u5634\u8C46\u788E\u7C92|\u786C\u7C92\u9EA6\u9762\u6761|\u5927\u9EA6\u9762\u997C|\u70D8\u5E72\u9EA6\u997C|\u89D2\u8C46\u9972\u6599|\u9972\u7528\u71D5\u9EA6|\u53BB\u58F3\u5C0F\u7C73|\u9EA6\u7CE0\u9972\u6599|\u6652\u5E72\u6241\u8C46"],
  ["europe-grain", "\u7CAE\u98DF", 6, 24, "grain", "gdansk riga lubeck hamburg novgorod bremen", "\u6CE2\u7F57\u7684\u6D77\u9ED1\u9EA6|\u7EF4\u65AF\u74E6\u6CB3\u5C0F\u9EA6|\u5317\u6D77\u71D5\u9EA6|\u6CE2\u7F8E\u62C9\u5C3C\u4E9A\u5927\u9EA6|\u9ED1\u9EA6\u7C89|\u835E\u9EA6\u7C92|\u835E\u9EA6\u7C89|\u53BB\u58F3\u71D5\u9EA6|\u71D5\u9EA6\u7C89|\u5564\u9152\u9EA6\u82BD|\u9ED1\u9EA6\u9EA6\u82BD|\u5E72\u8C4C\u8C46|\u5317\u65B9\u6241\u8C46|\u4E9A\u9EBB\u7C7D\u997C|\u82A5\u83DC\u7C7D\u6CB9|\u71D5\u9EA6\u997C|\u9ED1\u9EA6\u8239\u997C|\u5C0F\u9EA6\u8239\u997C"],
  ["asian-grain", "\u7CAE\u98DF", 5, 25, "grain", "guangzhou yangzhou ningbo chittagong pegu palembang", "\u5CAD\u5357\u7C7C\u7C73|\u6C5F\u5357\u7CB3\u7C73|\u5B5F\u52A0\u62C9\u9999\u7C73|\u7F05\u7538\u7A3B\u7C73|\u722A\u54C7\u7CD9\u7C73|\u7CEF\u7C73|\u7C73\u7C89|\u7CD9\u7C73\u7CE0|\u7A3B\u7C73\u997C|\u7EFF\u8C46|\u8D64\u5C0F\u8C46|\u9EC4\u8C46|\u9ED1\u8C46|\u9EC4\u8C46\u7C89|\u8131\u58F3\u9AD8\u7CB1|\u9ECD\u7C73|\u835E\u9EA6\u9762|\u7092\u7C73|\u5E72\u7C73\u7EBF|\u7C73\u66F2"],
  ["american-grain", "\u7CAE\u98DF", 8, 26, "grain", "veracruz callao acapulco guayaquil valparaiso", "\u58A8\u897F\u54E5\u767D\u7389\u7C73|\u58A8\u897F\u54E5\u9EC4\u7389\u7C73|\u5B89\u7B2C\u65AF\u7D2B\u7389\u7C73|\u7389\u7C73\u7C97\u7C89|\u70D8\u70E4\u7389\u7C73\u7C92|\u7389\u7C73\u9762\u997C|\u7EA2\u82B8\u8C46|\u9ED1\u82B8\u8C46|\u5357\u74DC\u7C7D|\u85DC\u9EA6|\u82CB\u83DC\u7C7D|\u5B89\u7B2C\u65AF\u51BB\u5E72\u85AF|\u6728\u85AF\u7C89|\u6728\u85AF\u8584\u997C|\u5E72\u8FA3\u6912\u7247|\u82B1\u751F\u4EC1|\u82B1\u751F\u6CB9|\u5357\u74DC\u5E72|\u756A\u85AF\u5E72|\u5229\u9A6C\u8C46"],
  ["salt", "\u76D0\u4E0E\u8C03\u5473", 0, 26, "salt", "dilmun magAN memphis lothal", "\u6D77\u6E7E\u7C97\u6D77\u76D0|\u8FEA\u5C14\u8499\u76D0\u5757|\u963F\u66FC\u6652\u76D0|\u5370\u5EA6\u6CB3\u6E56\u76D0|\u5C3C\u7F57\u6CB3\u5929\u7136\u78B1|\u7ED3\u6676\u98DF\u76D0|\u5E72\u814C\u76D0|\u9676\u7F50\u7EC6\u76D0|\u7070\u767D\u76D0\u997C|\u5364\u6C34\u76D0\u7816|\u6D17\u5236\u6D77\u76D0|\u7C97\u7C92\u814C\u9C7C\u76D0"],
  ["europe-salt", "\u76D0\u4E0E\u8C03\u5473", 6, 34, "salt", "lubeck la-rochelle porto ceuta tunis ravenna", "\u5415\u8BB7\u5821\u716E\u76D0|\u76D6\u6717\u5FB7\u7070\u76D0|\u62C9\u7F57\u8C22\u5C14\u6652\u76D0|\u8461\u8404\u7259\u7C97\u76D0|\u4E9A\u5F97\u91CC\u4E9A\u6D77\u76D0|\u7A81\u5C3C\u65AF\u76D0\u6676|\u4F0A\u6BD4\u5229\u4E9A\u76D0\u82B1|\u897F\u897F\u91CC\u5CA9\u76D0|\u76D0\u6E0D\u9178\u679C|\u8461\u8404\u9152\u918B|\u82F9\u679C\u918B|\u9EA6\u82BD\u918B|\u679C\u918B\u539F\u6DB2|\u82A5\u672B\u7C89|\u82A5\u672B\u818F|\u814C\u83DC\u5364"],
  ["fish", "\u6E14\u4EA7", 3, 37, "fish", "gadir tangier carthage syracuse rhodes", "\u76D0\u6E0D\u84DD\u9CCD\u91D1\u67AA\u9C7C|\u91D1\u67AA\u9C7C\u9C7C\u8179|\u98CE\u5E72\u9CAD\u9C7C|\u76D0\u6E0D\u6C99\u4E01\u9C7C|\u5E72\u51E4\u5C3E\u9C7C|\u51E4\u5C3E\u9C7C\u9171|\u53E4\u5178\u9C7C\u9732|\u6D53\u7F29\u9C7C\u9171|\u9C7C\u5375\u76D0\u818F|\u814C\u9CBB\u9C7C\u5375|\u6652\u5E72\u7AE0\u9C7C|\u6652\u5E72\u58A8\u9C7C|\u6D77\u9CD7\u5E72|\u76D0\u6E0D\u6D77\u9C88\u9C7C|\u91D1\u67AA\u9C7C\u6CB9|\u814C\u6A44\u6984\u9C7C\u9171"],
  ["north-fish", "\u6E14\u4EA7", 6, 42, "fish", "bergen visby lubeck st-johns bristol dublin", "\u632A\u5A01\u9CD5\u9C7C\u5E72|\u5351\u5C14\u6839\u68D2\u9C7C|\u76D0\u6E0D\u5927\u897F\u6D0B\u9CD5\u9C7C|\u5317\u6D77\u9CB1\u9C7C\u6876|\u70DF\u718F\u9CB1\u9C7C|\u6CE2\u7F57\u7684\u6D77\u9CB1\u9C7C|\u814C\u9C91\u9C7C|\u98CE\u5E72\u9C91\u9C7C|\u54B8\u9CAD\u9C7C|\u9C7C\u809D\u6CB9|\u9CD5\u9C7C\u80F6|\u9C7C\u9CD4\u80F6|\u814C\u9CD7\u9C7C|\u76D0\u6E0D\u6D77\u9CDF|\u70DF\u718F\u9ED1\u7EBF\u9CD5|\u9C7C\u7C89\u9972\u6599"],
  ["asian-fish", "\u6E14\u4EA7", 6, 43, "fish", "quanzhou ningbo hakata naha malacca makassar", "\u798F\u5EFA\u9C7C\u5E72|\u5B81\u6CE2\u9EC4\u9C7C\u9C9E|\u65E5\u672C\u9CA3\u9C7C\u5E72|\u5E72\u867E\u7C73|\u867E\u9171|\u9C7C\u9171\u6CB9|\u76D0\u6E0D\u5E26\u9C7C|\u6C99\u4E01\u9C7C\u5E72|\u6652\u5E72\u4E4C\u8D3C|\u6D77\u5E26\u5E72|\u7D2B\u83DC\u5E72|\u6D77\u82D4\u997C|\u7409\u7403\u6D77\u76D0\u9C7C|\u98DE\u9C7C\u5E72|\u9A6C\u516D\u7532\u867E\u818F|\u6D77\u87BA\u8089\u5E72|\u5E72\u9C7C\u80F6\u7247|\u6606\u5E03\u788E\u7247"],
  ["honey", "\u98DF\u54C1", 1, 44, "honey", "crete byblos ur athens thessaloniki", "\u514B\u91CC\u7279\u767E\u91CC\u9999\u871C|\u9ECE\u51E1\u7279\u5C71\u82B1\u871C|\u6CB3\u8C37\u8702\u871C|\u7231\u7434\u6D77\u677E\u871C|\u8702\u5DE2\u871C\u5757|\u538B\u69A8\u8702\u8721|\u9EC4\u8702\u8721|\u51C0\u5236\u767D\u8702\u8721|\u8702\u80F6|\u871C\u6D78\u65E0\u82B1\u679C|\u871C\u6E0D\u674F\u4EC1|\u829D\u9EBB\u871C\u997C|\u8702\u871C\u6D53\u6D46|\u9676\u5C01\u8702\u871C"],
  ["nuts", "\u98DF\u54C1", 3, 48, "nuts", "smyrna rhodes naples marseille trebizond", "\u5B89\u7EB3\u6258\u5229\u4E9A\u699B\u5B50|\u610F\u5927\u5229\u751C\u674F\u4EC1|\u9AD8\u52A0\u7D22\u6838\u6843|\u5730\u4E2D\u6D77\u677E\u5B50|\u6817\u5B50\u5E72|\u6817\u5B50\u7C89|\u53BB\u76AE\u699B\u4EC1|\u5E72\u6838\u6843\u4EC1|\u76D0\u7117\u674F\u4EC1|\u677E\u5B50\u4EC1|\u6652\u5E72\u6851\u845A|\u8461\u8404\u5E72\u997C|\u82F9\u679C\u5E72\u73AF|\u68A8\u812F|\u6A31\u6843\u5E72|\u6985\u6872\u818F|\u5C71\u6942\u679C\u5E72|\u5E72\u8537\u8587\u679C"],
  ["wine", "\u9152\u996E", 3, 95, "wine", "rhodes crete ostia naples syracuse marseille", "\u7F57\u5F97\u5C9B\u9676\u575B\u9152|\u514B\u91CC\u7279\u751C\u8461\u8404\u9152|\u574E\u5E15\u5C3C\u4E9A\u7EA2\u8461\u8404\u9152|\u897F\u897F\u91CC\u767D\u8461\u8404\u9152|\u5E0C\u4FC4\u65AF\u6D77\u5C9B\u9152|\u7231\u7434\u6D77\u6811\u8102\u9152|\u9ECE\u51E1\u7279\u8461\u8404\u9152|\u9A6C\u8D5B\u8461\u8404\u9152|\u6D53\u7F29\u8461\u8404\u9152\u6C41|\u52A0\u871C\u8461\u8404\u9152|\u9999\u8349\u6D78\u8461\u8404\u9152|\u8461\u8404\u6E23\u84B8\u998F\u539F\u6599|\u9676\u5C01\u9648\u8461\u8404\u9152|\u65B0\u917F\u6D51\u8461\u8404\u9152"],
  ["later-wine", "\u9152\u996E", 8, 118, "wine", "porto bordeaux lisbon seville funchal malaga", "\u675C\u7F57\u6CB3\u7EA2\u8461\u8404\u9152|\u6CE2\u5C14\u591A\u7EA2\u8461\u8404\u9152|\u96EA\u8389\u767D\u8461\u8404\u9152|\u9A6C\u5FB7\u62C9\u8461\u8404\u9152|\u9A6C\u62C9\u52A0\u751C\u9152|\u91CC\u65AF\u672C\u6876\u88C5\u9152|\u52A0\u90A3\u5229\u751C\u8461\u8404\u9152|\u666E\u7F57\u65FA\u65AF\u6843\u7EA2\u9152|\u4F0A\u6BD4\u5229\u4E9A\u9E9D\u9999\u8461\u8404\u9152|\u52C3\u826E\u7B2C\u8461\u8404\u9152|\u83B1\u8335\u767D\u8461\u8404\u9152|\u610F\u5927\u5229\u9A6C\u5C14\u74E6\u897F\u4E9A\u9152|\u8461\u8404\u767D\u5170\u5730|\u679C\u6E23\u70C8\u9152|\u6A61\u6728\u6876\u9648\u9152|\u5546\u8239\u8865\u7ED9\u8461\u8404\u9152"],
  ["beer", "\u9152\u996E", 6, 57, "beer", "hamburg bremen lubeck gdansk bristol dublin", "\u6C49\u5821\u5564\u9152|\u4E0D\u6765\u6885\u9EA6\u9152|\u5415\u8D1D\u514B\u6876\u88C5\u5564\u9152|\u683C\u4F46\u65AF\u514B\u6D53\u5564\u9152|\u82F1\u683C\u5170\u68D5\u9EA6\u9152|\u7231\u5C14\u5170\u9EA6\u9152|\u9ED1\u9EA6\u5564\u9152|\u71D5\u9EA6\u9EA6\u9152|\u8702\u871C\u9152|\u82F9\u679C\u9152|\u68A8\u9152|\u675C\u677E\u6D78\u9152|\u5564\u9152\u82B1\u5E72|\u6DE1\u8272\u9EA6\u82BD|\u70D8\u70E4\u9EA6\u82BD|\u5564\u9152\u9175\u6CE5"],
  ["asian-drinks", "\u9152\u996E", 7, 78, "wine", "hangzhou ningbo quanzhou sakai hakata hoi-an", "\u7ECD\u5174\u9EC4\u9152|\u6C5F\u5357\u7C73\u9152|\u798F\u5EFA\u7EA2\u66F2\u9152|\u65E5\u672C\u6D4A\u9152|\u65E5\u672C\u6E05\u9152|\u7CEF\u7C73\u751C\u9152|\u6885\u5B50\u6D78\u9152|\u8354\u679D\u679C\u9152|\u6842\u82B1\u7C73\u9152|\u59DC\u6C41\u7C73\u9152|\u7EA2\u66F2\u7C73|\u9EC4\u9152\u9152\u6BCD|\u9152\u66F2\u5757|\u6842\u82B1\u7CD6\u6D46"],
  ["oil", "\u6CB9\u8102", 1, 69, "oil", "crete ugarit carthage tyre", "\u514B\u91CC\u7279\u521D\u69A8\u6A44\u6984\u6CB9|\u9ECE\u51E1\u7279\u98DF\u7528\u6A44\u6984\u6CB9|\u5317\u975E\u706F\u7528\u6A44\u6984\u6CB9|\u6A44\u6984\u6E23\u6CB9|\u9676\u5C01\u6A44\u6984\u6CB9|\u51C0\u5236\u706F\u6CB9|\u829D\u9EBB\u9999\u6CB9|\u4E9A\u9EBB\u7C7D\u6CB9|\u84D6\u9EBB\u706F\u6CB9|\u674F\u4EC1\u6CB9|\u52A8\u7269\u8102\u8721|\u7F8A\u8102\u818F|\u6A44\u6984\u6CB9\u7682\u576F|\u9999\u8349\u6D78\u6CB9"],
  ["tropical-oil", "\u6CB9\u8102", 8, 63, "oil", "benin bonny cochin galle makassar palembang", "\u51E0\u5185\u4E9A\u68D5\u6988\u6CB9|\u68D5\u6988\u4EC1\u6CB9|\u9A6C\u62C9\u5DF4\u5C14\u6930\u5B50\u6CB9|\u9521\u5170\u6930\u84C9|\u5E72\u6930\u8089|\u6930\u58F3\u70AD|\u6930\u5B50\u7EA4\u7EF4|\u6930\u5B50\u6CB9\u7682\u6599|\u5370\u695D\u7C7D\u6CB9|\u829D\u9EBB\u997C|\u82B1\u751F\u6CB9\u997C|\u68D5\u6988\u8721|\u690D\u7269\u706F\u6CB9|\u6930\u58F3\u676F"],
  ["sugar", "\u7CD6\u4E0E\u751C\u98DF", 8, 124, "sugar", "funchal salvador recife havana santo-domingo", "\u9A6C\u5FB7\u62C9\u7CD6\u9525|\u5DF4\u897F\u539F\u8517\u7CD6|\u52A0\u52D2\u6BD4\u9EC4\u7CD6|\u7EA2\u8910\u7CD6\u5757|\u7CBE\u6EE4\u767D\u7CD6|\u8517\u7CD6\u871C|\u9ED1\u7CD6\u871C|\u7CD6\u971C\u788E\u5C51|\u51B0\u7CD6\u6676\u4F53|\u5C0F\u7CD6\u9525|\u7CD6\u6D46\u6876|\u7CD6\u6E0D\u67D1\u6A58\u76AE|\u871C\u996F\u59DC\u5757|\u7CD6\u6E0D\u674F\u4EC1|\u8517\u7CD6\u7CD5|\u7518\u8517\u6E23\u71C3\u6599"],
  ["cocoa", "\u53EF\u53EF\u4E0E\u7F8E\u6D32\u9999\u6599", 8, 170, "cocoa", "veracruz acapulco guayaquil cartagena", "\u58A8\u897F\u54E5\u53EF\u53EF\u8C46|\u5371\u5730\u9A6C\u62C9\u53EF\u53EF\u8C46|\u5384\u74DC\u591A\u5C14\u53EF\u53EF\u8C46|\u70D8\u7119\u53EF\u53EF\u4EC1|\u78E8\u5236\u53EF\u53EF\u818F|\u53EF\u53EF\u8102|\u538B\u5236\u53EF\u53EF\u997C|\u9999\u8349\u835A|\u5E72\u591A\u9999\u679C|\u80ED\u8102\u6811\u7C7D|\u80ED\u8102\u6811\u7C7D\u7C89|\u58A8\u897F\u54E5\u8FA3\u6912\u5E72|\u70DF\u718F\u8FA3\u6912|\u8FA3\u6912\u788E|\u70D8\u70E4\u9999\u8349\u53EF\u53EF|\u7389\u7C73\u53EF\u53EF\u996E\u6599\u6599"],
  ["coffee", "\u8336\u4E0E\u5496\u5561", 9, 191, "coffee", "mocha aden jeddah batavia", "\u6469\u5361\u751F\u5496\u5561\u8C46|\u4E5F\u95E8\u5C71\u5730\u5496\u5561\u8C46|\u54C8\u62C9\u5C14\u5496\u5561\u8C46|\u722A\u54C7\u751F\u5496\u5561\u8C46|\u65E5\u6652\u5496\u5561\u679C|\u53BB\u58F3\u5496\u5561\u4EC1|\u6D45\u7119\u5496\u5561\u8C46|\u6DF1\u7119\u5496\u5561\u8C46|\u77F3\u78E8\u5496\u5561\u7C89|\u5496\u5561\u679C\u58F3\u8336|\u5C0F\u7C92\u5706\u5496\u5561\u8C46|\u9676\u5C01\u719F\u5496\u5561\u8C46|\u9999\u6599\u5496\u5561\u6599|\u5496\u5561\u8C46\u82D7\u5703\u79CD"],
  ["tea", "\u8336\u4E0E\u5496\u5561", 7, 160, "tea", "hangzhou ningbo fuzhou quanzhou yuegang", "\u6C5F\u5357\u6563\u7EFF\u8336|\u6D59\u6C5F\u84B8\u9752\u8336|\u798F\u5EFA\u56E2\u8336|\u5317\u82D1\u8D21\u8336\u997C|\u5EFA\u5DDE\u8721\u9762\u8336|\u6B66\u5937\u5CA9\u8336|\u677E\u841D\u7092\u9752\u8336|\u73E0\u5F62\u7EFF\u8336|\u7C97\u53F6\u8FB9\u9500\u8336|\u8336\u672B|\u538B\u5236\u8336\u7816|\u8309\u8389\u7AA8\u8336|\u6842\u82B1\u7AA8\u8336|\u70D8\u7119\u8336\u6897|\u65E5\u6652\u8336\u53F6|\u82BD\u53F6\u7EFF\u8336|\u8336\u82B1\u5E72|\u9676\u7F50\u5C01\u8336"],
  ["pepper", "\u9999\u6599", 6, 147, "pepper", "muziris calicut cochin quilon aceh banten", "\u9A6C\u62C9\u5DF4\u5C14\u9ED1\u80E1\u6912|\u5361\u5229\u5361\u7279\u80E1\u6912|\u4E9A\u9F50\u80E1\u6912|\u4E07\u4E39\u80E1\u6912|\u8131\u76AE\u767D\u80E1\u6912|\u6652\u5E72\u9752\u80E1\u6912|\u957F\u80E1\u6912|\u80E1\u6912\u788E\u7C92|\u7C97\u78E8\u9ED1\u80E1\u6912|\u7EC6\u78E8\u767D\u80E1\u6912|\u80E1\u6912\u85E4\u79CD\u7A57|\u9676\u5C01\u80E1\u6912|\u80E1\u6912\u7A57\u5E72|\u76D0\u6E0D\u9752\u80E1\u6912|\u722A\u54C7\u957F\u80E1\u6912|\u9999\u6599\u80E1\u6912\u6DF7\u6599"],
  ["cinnamon", "\u9999\u6599", 6, 170, "cinnamon", "galle colombo quilon guangzhou", "\u9521\u5170\u8089\u6842\u6761|\u9521\u5170\u8089\u6842\u788E|\u6842\u76AE\u5377|\u8089\u6842\u7C89|\u4E2D\u56FD\u6842\u76AE|\u6842\u679D|\u6842\u82B1\u5E72\u74E3|\u8089\u6842\u53F6|\u8089\u6842\u82B1\u857E|\u8089\u6842\u6839\u76AE|\u6842\u76AE\u9999\u6CB9|\u6842\u76AE\u9999\u56CA\u6599|\u59DC\u9EC4\u6839|\u59DC\u9EC4\u7C89|\u5E72\u59DC\u7247|\u751F\u59DC\u7C89"],
  ["moluccan-spices", "\u9999\u6599", 7, 265, "cloves", "ternate banda makassar malacca", "\u7279\u5C14\u7EB3\u7279\u4E01\u9999\u82DE|\u8482\u591A\u96F7\u4E01\u9999|\u4E01\u9999\u6897|\u4E01\u9999\u788E\u672B|\u4E01\u9999\u53F6|\u4E01\u9999\u9999\u6CB9|\u73ED\u8FBE\u8089\u8C46\u853B\u4EC1|\u8089\u8C46\u853B\u8863|\u6574\u58F3\u8089\u8C46\u853B|\u8089\u8C46\u853B\u7C89|\u5E72\u8089\u8C46\u853B\u679C\u76AE|\u8089\u8C46\u853B\u9999\u6CB9|\u9AD8\u826F\u59DC\u7247|\u8C46\u853B\u679C|\u722A\u54C7\u8C46\u853B|\u9999\u8305\u5E72\u675F"],
  ["indian-spices", "\u9999\u6599", 5, 117, "spices", "calicut cambay bharuch chaul cochin", "\u7EFF\u8C46\u853B|\u9ED1\u8C46\u853B|\u846B\u82A6\u5DF4\u7C7D|\u9ED1\u79CD\u8349\u7C7D|\u5370\u5EA6\u83B3\u841D\u7C7D|\u5C0F\u8334\u9999\u7C7D|\u963F\u9B4F\u6811\u8102|\u7F57\u671B\u5B50\u5E72|\u5496\u55B1\u53F6\u5E72|\u5E72\u8292\u679C\u7C89|\u85CF\u7EA2\u82B1\u4E1D|\u85CF\u7EA2\u82B1\u788E|\u767D\u82A5\u5B50|\u9ED1\u82A5\u5B50|\u82AB\u837D\u7C89|\u5B5C\u7136\u7C89|\u5E72\u67E0\u6AAC|\u77F3\u69B4\u7C7D\u7C89"],
  ["med-herbs", "\u8349\u836F\u4E0E\u9999\u8349", 3, 68, "herbs", "alexandria ephesus rhodes ostia byblos", "\u57C3\u53CA\u6D0B\u7518\u83CA|\u5E72\u9F20\u5C3E\u8349|\u8FF7\u8FED\u9999\u675F|\u85B0\u8863\u8349\u82B1|\u6708\u6842\u53F6|\u725B\u81F3\u5E72\u53F6|\u83B3\u841D\u82B1|\u8334\u9999\u7C7D|\u7518\u8349\u6839|\u8700\u8475\u6839|\u82A6\u835F\u818F|\u756A\u6CFB\u53F6|\u8F66\u524D\u5B50|\u5E72\u73AB\u7470\u82B1|\u9999\u8702\u8349|\u5E72\u82B8\u9999|\u675C\u677E\u5B50|\u4E73\u9999\u7C89"],
  ["asian-herbs", "\u8349\u836F\u4E0E\u9999\u8349", 7, 95, "herbs", "quanzhou guangzhou fuzhou busan hakata", "\u7518\u8349\u7247|\u5927\u9EC4\u6839|\u5F53\u5F52\u7247|\u9EC4\u82AA\u6839|\u515A\u53C2\u6839|\u9648\u76AE|\u9752\u76AE|\u5C71\u6942\u7247|\u832F\u82D3\u5757|\u83CA\u82B1\u5E72|\u91D1\u94F6\u82B1\u5E72|\u827E\u53F6|\u8584\u8377\u6897|\u6854\u6897\u7247|\u5E72\u67B8\u675E|\u4E94\u5473\u5B50|\u5E72\u5C71\u836F|\u5DDD\u828E\u7247|\u767D\u82B7\u7247|\u7D2B\u82CF\u7C7D"],
  ["aromatics", "\u9999\u6599\u4E0E\u6811\u8102", 3, 149, "resin", "qana aden adulis magAN sohar", "\u963F\u66FC\u4E73\u9999|\u54C8\u5FB7\u62C9\u6BDB\u4E73\u9999|\u7D22\u9A6C\u91CC\u6CA1\u836F|\u51C0\u9009\u4E73\u9999\u73E0|\u4E73\u9999\u788E\u7C92|\u6CA1\u836F\u7C89|\u9999\u8102\u6811\u8102|\u9F99\u8840\u6811\u8102|\u963F\u62C9\u4F2F\u6811\u80F6|\u6811\u8102\u9999\u997C|\u9999\u7089\u6DF7\u9999|\u5E72\u9999\u6839|\u4E73\u9999\u6CB9\u818F|\u6CA1\u836F\u9999\u818F|\u9999\u6728\u5C51|\u5C01\u53E3\u6811\u8102"],
  ["se-asian-aromatics", "\u9999\u6599\u4E0E\u6811\u8102", 6, 164, "resin", "barus palembang brunei hoi-an kedah", "\u5DF4\u9C81\u65AF\u9F99\u8111|\u82CF\u95E8\u7B54\u814A\u5B89\u606F\u9999|\u5A46\u7F57\u6D32\u6A1F\u8111|\u5360\u57CE\u6C89\u9999|\u767D\u6728\u9999|\u8FBE\u739B\u6811\u8102|\u85E4\u9EC4\u6811\u8102|\u82CF\u5408\u9999\u8102|\u964D\u771F\u9999\u6728|\u9999\u8305\u6CB9\u6599|\u6A80\u9999\u6728\u5C51|\u4E4C\u6728\u9999\u76D2|\u6C89\u9999\u788E\u7247|\u6A1F\u6728\u5C51|\u9F99\u8111\u9999\u7C89|\u5B89\u606F\u9999\u5757"],
  ["linen", "\u7EA4\u7EF4\u4E0E\u5E03\u6599", 0, 40, "linen", "memphis lothal byblos ur", "\u57C3\u53CA\u4E9A\u9EBB\u539F\u675F|\u6CA4\u5236\u4E9A\u9EBB\u830E|\u68B3\u7406\u4E9A\u9EBB\u7EA4\u7EF4|\u4E9A\u9EBB\u7EB1\u56E2|\u7C97\u9EBB\u5E73\u7EB9\u5E03|\u7EC6\u652F\u4E9A\u9EBB\u5E03|\u6F02\u767D\u4E9A\u9EBB\u5E03|\u672A\u6F02\u4E9A\u9EBB\u5E03|\u4E9A\u9EBB\u5E06\u5E03|\u9EBB\u5E03\u888B|\u4E9A\u9EBB\u7EF7\u5E26\u5377|\u4E9A\u9EBB\u7F51\u7EBF|\u7A84\u5E45\u9EBB\u5E26|\u4E9A\u9EBB\u7F1D\u7EAB\u7EBF|\u9EBB\u7D6E|\u4E9A\u9EBB\u5305\u88F9\u5E03"],
  ["cotton", "\u7EA4\u7EF4\u4E0E\u5E03\u6599", 6, 107, "cotton", "cambay surat chittagong masulipatnam pulicat", "\u5B5F\u52A0\u62C9\u7EC6\u68C9\u5E03|\u53E4\u5409\u62C9\u7279\u68C9\u5E03|\u79D1\u7F57\u66FC\u5FB7\u5C14\u5370\u82B1\u5E03|\u82CF\u62C9\u7279\u767D\u68C9\u5E03|\u624B\u7EBA\u68C9\u7EB1|\u8F67\u5236\u68C9\u82B1|\u68C9\u7D6E\u5305|\u7EC6\u5E73\u7EB9\u68C9\u5E03|\u7C97\u5E73\u7EB9\u68C9\u5E03|\u975B\u84DD\u68C9\u5E03|\u7EA2\u67D3\u68C9\u5E03|\u6761\u7EB9\u68C9\u5E03|\u683C\u7EB9\u68C9\u5E03|\u6728\u7248\u5370\u82B1\u68C9\u5E03|\u68C9\u5E03\u5934\u5DFE|\u68C9\u5E03\u88AB\u9762|\u68C9\u7EBF\u6E14\u7F51|\u68C9\u5E03\u5E06\u7247|\u68C9\u7EC7\u8170\u5E26|\u68C9\u5E03\u5305\u5DFE"],
  ["wool", "\u7EA4\u7EF4\u4E0E\u5E03\u6599", 6, 99, "wool", "bruges antwerp bristol dublin edinburgh bordeaux", "\u82F1\u683C\u5170\u7F8A\u6BDB|\u82CF\u683C\u5170\u7F8A\u6BDB|\u7231\u5C14\u5170\u7F8A\u6BDB|\u4F0A\u6BD4\u5229\u4E9A\u7EC6\u7F8A\u6BDB|\u6D17\u51C0\u7F8A\u6BDB|\u68B3\u7406\u7F8A\u6BDB\u6761|\u7C97\u7EBA\u6BDB\u7EB1|\u7CBE\u7EBA\u6BDB\u7EB1|\u4F5B\u5170\u5FB7\u65AF\u6BDB\u5462|\u7F29\u7ED2\u6BDB\u5462|\u659C\u7EB9\u6BDB\u5E03|\u539A\u7ED2\u6597\u7BF7\u6599|\u7C97\u5462\u5E03|\u6BDB\u6BE1\u7247|\u7F8A\u6BDB\u6BEF|\u67D3\u7EA2\u6BDB\u5462|\u84DD\u8272\u6BDB\u5462|\u6761\u683C\u6BDB\u5E03|\u6BDB\u889C|\u7F8A\u6BDB\u5E3D"],
  ["silk", "\u4E1D\u7EC7\u54C1", 6, 188, "silk", "guangzhou quanzhou hangzhou ningbo yangzhou", "\u6C5F\u5357\u751F\u4E1D|\u53CC\u5BAB\u4E1D|\u4E1D\u7EF5|\u7EE2\u7EB1|\u7F2B\u4E1D\u7EBF|\u7D20\u7EE2|\u8F7B\u7EB1|\u7F57\u7EB1|\u6697\u82B1\u7EEB|\u7D20\u7F0E|\u63D0\u82B1\u7F0E|\u7EC7\u9526|\u7F02\u4E1D\u7247|\u7EE3\u82B1\u7EE2|\u4E1D\u7EF8\u5E15|\u7EE2\u6247\u9762|\u5F69\u4E1D\u7EE6|\u7EC7\u91D1\u9526|\u82B1\u7EEB\u8863\u6599|\u7EC9\u7EB1|\u4E1D\u7EF8\u8170\u5E26|\u7EE3\u7EBF\u675F|\u67D3\u8272\u4E1D\u7EBF|\u7EF8\u7F0E\u5305\u88B1"],
  ["western-silk", "\u4E1D\u7EC7\u54C1", 7, 209, "silk", "constantinople venice genoa ragusa famagusta", "\u62DC\u5360\u5EAD\u7D2B\u7EF8|\u610F\u5927\u5229\u4E1D\u7ED2|\u5A01\u5C3C\u65AF\u91D1\u4E1D\u7F0E|\u70ED\u90A3\u4E9A\u7ED2\u9526|\u9ECE\u51E1\u7279\u6761\u7EB9\u7EF8|\u4E1D\u68C9\u4EA4\u7EC7\u5E03|\u4E1D\u9EBB\u4EA4\u7EC7\u5E03|\u7EE3\u82B1\u5E37\u5E54|\u4E1D\u7EF8\u684C\u8986|\u9526\u7F0E\u6795\u5957|\u4E1D\u7EC7\u7F0E\u5E26|\u6559\u5802\u7EB9\u9526|\u4E1D\u7EF8\u65D7\u9762|\u5546\u4F1A\u7EB9\u7AE0\u7EF8"],
  ["bast-fibres", "\u7EA4\u7EF4\u4E0E\u7EF3\u7D22", 6, 61, "fibre", "riga gdansk novgorod hamburg lubeck", "\u6CE2\u7F57\u7684\u6D77\u5927\u9EBB\u7EA4\u7EF4|\u4FC4\u7F57\u65AF\u9EBB\u675F|\u6CA4\u5236\u5927\u9EBB|\u8239\u7528\u9EBB\u7EB1|\u7C97\u637B\u9EBB\u7EF3|\u7EC6\u637B\u9EBB\u7EF3|\u7F06\u7EF3\u9EBB\u82AF|\u7126\u6CB9\u6D78\u9EBB\u7EBF|\u7C97\u9EBB\u5E06\u5E03|\u9EBB\u888B\u5E03|\u82CE\u9EBB\u7EA4\u7EF4|\u82CE\u9EBB\u7EB1|\u9EC4\u9EBB\u7C97\u5E03|\u9EBB\u7D6E\u586B\u7F1D\u6599|\u7F51\u5177\u9EBB\u7EBF|\u9EBB\u7EC7\u540A\u5E8A"],
  ["dyes", "\u67D3\u6599", 3, 136, "dye", "tyre sidon alexandria smyrna gadir", "\u63A8\u7F57\u9AA8\u87BA\u7D2B|\u7D2B\u67D3\u6D53\u818F|\u831C\u8349\u6839|\u831C\u8349\u7EA2\u7C89|\u7EA2\u82B1\u82B1\u74E3|\u7EA2\u82B1\u67D3\u818F|\u975B\u9752\u67D3\u997C|\u83D8\u84DD\u67D3\u6599|\u6728\u7280\u8349\u9EC4|\u77F3\u69B4\u76AE\u67D3\u6599|\u680E\u763F|\u97A3\u9178\u763F\u7C89|\u82CF\u6728\u788E\u7247|\u70DF\u7070\u58A8\u6599|\u9EC4\u571F\u989C\u6599|\u8D6D\u77F3\u7C89|\u7EFF\u571F\u989C\u6599|\u70AD\u9ED1\u7C89"],
  ["later-dyes", "\u67D3\u6599", 8, 177, "dye", "veracruz acapulco salvador recife surat cambay", "\u58A8\u897F\u54E5\u80ED\u8102\u866B\u7EA2|\u80ED\u8102\u7EA2\u67D3\u997C|\u5DF4\u897F\u7EA2\u6728\u5C51|\u4F2F\u5357\u5E03\u54E5\u67D3\u6728|\u58A8\u897F\u54E5\u6D0B\u82CF\u6728|\u975B\u84DD\u67D3\u5757|\u5370\u5EA6\u975B\u84DD\u7C89|\u5B89\u7EB3\u6258\u80ED\u8102\u7C89|\u59DC\u9EC4\u67D3\u7C89|\u8BC3\u5B50\u67D3\u6599|\u9ED1\u513F\u8336|\u6CA1\u98DF\u5B50\u67D3\u818F|\u7D2B\u80F6\u67D3\u6599|\u7EA2\u6A80\u9999\u7C89|\u69D0\u82B1\u9EC4\u67D3\u6599|\u660E\u77FE\u5A92\u67D3\u6599"],
  ["leather", "\u76AE\u9769", 3, 94, "leather", "carthage tripoli tangier ostia thessaloniki", "\u5C71\u7F8A\u97A3\u76AE|\u7EF5\u7F8A\u8F6F\u76AE|\u725B\u97A3\u9769|\u8584\u7F8A\u76AE|\u7C97\u725B\u76AE|\u6CB9\u97A3\u76AE|\u67D3\u7EA2\u5C71\u7F8A\u76AE|\u67D3\u9ED1\u725B\u76AE|\u76AE\u9769\u6C34\u56CA|\u7F8A\u76AE\u9152\u56CA|\u76AE\u9769\u5305\u888B|\u76AE\u5236\u7ED1\u5E26|\u76AE\u9769\u978B\u5E95|\u76AE\u7EF3\u5377|\u76AE\u9769\u4E66\u5C01\u6599|\u76AE\u76FE\u5305\u9762|\u978D\u5177\u76AE\u7247|\u725B\u76AE\u80F6"],
  ["northern-leather", "\u76AE\u9769\u4E0E\u6BDB\u76AE", 9, 162, "leather", "novgorod riga quebec new-amsterdam boston", "\u4FC4\u56FD\u8721\u97A3\u9769|\u6CE2\u7F57\u7684\u6D77\u9E7F\u76AE|\u52A0\u62FF\u5927\u6D77\u72F8\u76AE|\u5317\u7F8E\u9E7F\u76AE|\u6C34\u736D\u6BDB\u76AE|\u72D0\u6BDB\u76AE|\u677E\u9F20\u6BDB\u76AE|\u8C82\u6BDB\u76AE|\u5154\u6BDB\u76AE|\u7F8A\u7F94\u6BDB\u76AE|\u9A6F\u9E7F\u76AE|\u67D4\u97A3\u9E7F\u76AE|\u6BDB\u76AE\u5E3D\u6599|\u76AE\u9769\u624B\u5957|\u6BDB\u6BE1\u5E3D\u576F|\u97A3\u76AE\u6811\u76AE|\u76AE\u9769\u9632\u6C34\u8102|\u76AE\u9769\u65C5\u884C\u7BB1"],
  ["cedar-wood", "\u6728\u6750", 0, 65, "cedar", "byblos ugarit arwad sidon", "\u9ECE\u5DF4\u5AE9\u96EA\u677E\u539F\u6728|\u96EA\u677E\u8239\u677F|\u96EA\u677E\u6881\u6728|\u96EA\u677E\u8584\u677F|\u96EA\u677E\u6728\u7BB1|\u96EA\u677E\u6845\u6746\u6750|\u96EA\u677E\u6728\u9489|\u96EA\u677E\u6728\u5C51|\u67CF\u6728\u539F\u6728|\u67CF\u6728\u8239\u677F|\u6A44\u6984\u6728\u6599|\u6A44\u6984\u6728\u7897|\u53D9\u5229\u4E9A\u677E\u6728|\u677E\u8102\u5757|\u6728\u70AD\u888B|\u6728\u5DE5\u5228\u82B1"],
  ["europe-wood", "\u6728\u6750", 6, 79, "wood", "riga gdansk bergen stockholm hamburg novgorod", "\u6CE2\u7F57\u7684\u6D77\u6A61\u6728|\u632A\u5A01\u677E\u6728|\u745E\u5178\u6749\u6728|\u767D\u6866\u539F\u6728|\u5C71\u6BDB\u6989\u6728\u6599|\u6986\u6728\u6599|\u68A3\u6728\u6599|\u80E1\u6843\u6728\u677F|\u6A61\u6728\u8239\u808B|\u957F\u76F4\u677E\u6845\u6750|\u51B7\u6749\u8239\u677F|\u6A61\u6728\u6876\u677F|\u767D\u6866\u6811\u76AE|\u677E\u6728\u7126\u6CB9|\u6728\u6CA5\u9752|\u6866\u76AE\u7126\u6CB9|\u70AD\u5316\u6728\u70AD|\u6A61\u6728\u6728\u9489|\u6986\u6728\u6C34\u7BA1|\u6866\u6728\u5668\u76BF"],
  ["tropical-wood", "\u6728\u6750", 7, 118, "wood", "pegu martaban cochin galle brunei makassar", "\u7F05\u7538\u67DA\u6728|\u9A6C\u62C9\u5DF4\u5C14\u67DA\u6728|\u9521\u5170\u4E4C\u6728|\u5A46\u7F57\u6D32\u94C1\u6728|\u82CF\u62C9\u5A01\u897F\u786C\u6728|\u5370\u5EA6\u7D2B\u6A80|\u9EC4\u6A80\u677F\u6599|\u7EA2\u6728\u5C0F\u6599|\u7AF9\u7AFF\u675F|\u85E4\u6761\u675F|\u68D5\u6988\u6728\u6599|\u6930\u58F3\u5DE5\u827A\u6599|\u67DA\u6728\u8239\u677F|\u67DA\u6728\u8239\u808B|\u4E4C\u6728\u9970\u677F|\u7AF9\u7BFE|\u85E4\u7F16\u7B50|\u85E4\u7F06|\u68D5\u6988\u53F6\u5E2D|\u7AF9\u7F16\u7BB1"],
  ["american-wood", "\u6728\u6750", 8, 111, "wood", "havana salvador recife guayaquil veracruz", "\u52A0\u52D2\u6BD4\u6843\u82B1\u5FC3\u6728|\u4E2D\u7F8E\u6D32\u96EA\u677E|\u5DF4\u897F\u67D3\u6728\u539F\u6BB5|\u74DC\u4E9A\u57FA\u5C14\u8F7B\u6728|\u58A8\u897F\u54E5\u677E\u6728|\u7259\u4E70\u52A0\u6108\u521B\u6728|\u6843\u82B1\u5FC3\u6728\u677F|\u96EA\u677E\u70DF\u53F6\u7BB1|\u8F7B\u6728\u6D6E\u6750|\u786C\u6728\u8239\u6813|\u67D3\u6728\u6728\u7247|\u6811\u8102\u5C01\u7F1D\u6599|\u6728\u6876\u585E|\u786C\u6728\u6ED1\u8F6E\u576F|\u68D5\u6988\u7F16\u5E2D|\u7AF9\u6728\u8D27\u7B50"],
  ["copper", "\u91D1\u5C5E", 0, 80, "copper", "magAN dilmun ur lothal", "\u963F\u66FC\u7C97\u94DC|\u9A6C\u5E72\u94DC\u952D|\u7194\u70BC\u7EA2\u94DC|\u94DC\u77FF\u77F3|\u5B54\u96C0\u77F3\u77FF\u5757|\u7EA2\u94DC\u677F|\u7EA2\u94DC\u7EBF|\u94DC\u6761|\u94DC\u9489|\u94DC\u94C6\u9489|\u94DC\u7247\u9970\u6599|\u94DC\u9525|\u94DC\u51FF|\u94DC\u9C7C\u94A9|\u94DC\u624B\u956F|\u94DC\u76C6|\u94DC\u58F6|\u94DC\u79E4\u7823"],
  ["bronze", "\u91D1\u5C5E\u4E0E\u5668\u5177", 1, 112, "copper", "crete ugarit salamis arwad", "\u9752\u94DC\u952D|\u9AD8\u9521\u9752\u94DC|\u4F4E\u9521\u9752\u94DC|\u94C5\u9752\u94DC\u576F|\u9521\u77FF\u7802|\u9521\u6761|\u9752\u94DC\u65A7|\u9752\u94DC\u51FF|\u9752\u94DC\u952F|\u9752\u94DC\u9570|\u9752\u94DC\u9488|\u9752\u94DC\u955C|\u9752\u94DC\u94C3|\u9752\u94DC\u6263|\u9752\u94DC\u781D\u7801|\u9752\u94DC\u76D8|\u9752\u94DC\u706F|\u9752\u94DC\u95E8\u94F0"],
  ["iron", "\u91D1\u5C5E\u4E0E\u5668\u5177", 3, 91, "iron", "sinope ostia gadir naples miletus", "\u5757\u70BC\u94C1|\u719F\u94C1\u6761|\u953B\u94C1\u677F|\u8F6F\u94C1\u4E1D|\u94C1\u77FF\u77F3|\u8D64\u94C1\u77FF|\u78C1\u94C1\u77FF|\u94C1\u9489|\u94C1\u94C6\u9489|\u94C1\u94FE|\u94C1\u951A\u722A|\u94C1\u73AF|\u94C1\u7281\u94E7|\u94C1\u9504\u5934|\u94C1\u9570\u5200|\u94C1\u9524|\u94C1\u94B3|\u94C1\u51FF|\u94C1\u952F\u6761|\u94C1\u9505"],
  ["later-metals", "\u91D1\u5C5E\u4E0E\u5668\u5177", 7, 131, "iron", "stockholm antwerp hamburg sakai nagasaki", "\u745E\u5178\u6761\u94C1|\u65E5\u672C\u94C1\u7802|\u7CBE\u70BC\u94A2\u6761|\u6E17\u78B3\u94A2\u576F|\u5203\u5177\u94A2\u6599|\u5F39\u7C27\u94A2\u7247|\u94A2\u952F|\u94A2\u9509|\u94A2\u94BB\u5934|\u94F8\u94C1\u9505|\u94C1\u5236\u7089\u677F|\u94DC\u9521\u710A\u6599|\u9EC4\u94DC\u677F|\u9EC4\u94DC\u4E1D|\u9EC4\u94DC\u94C6\u9489|\u94C5\u677F|\u94C5\u952D|\u9521\u5668\u5408\u91D1|\u950C\u77FF\u77F3|\u9EC4\u94DC\u6263\u4EF6"],
  ["precious-metals", "\u8D35\u91D1\u5C5E", 8, 411, "silver", "veracruz acapulco callao nagasaki lisbon", "\u5B89\u7B2C\u65AF\u94F6\u952D|\u58A8\u897F\u54E5\u94F6\u952D|\u65E5\u672C\u94F6\u952D|\u7EC6\u94F6\u6761|\u94F6\u7247|\u94F6\u4E1D|\u94F6\u7B94|\u94F6\u7C92|\u94F6\u5668\u576F|\u91D1\u5E01\u7194\u6599|\u91D1\u7B94|\u91D1\u4E1D|\u91D1\u7C92|\u91D1\u94F6\u5408\u91D1\u6761|\u94F6\u710A\u6599|\u94F6\u676F|\u94F6\u52FA|\u94F6\u70DB\u53F0|\u94F6\u9970\u94FE|\u94F6\u5236\u5E26\u6263"],
  ["gold", "\u8D35\u91D1\u5C5E", 8, 395, "gold", "elmina accra sofala kilwa mozambique", "\u51E0\u5185\u4E9A\u7802\u91D1|\u9EC4\u91D1\u6D77\u5CB8\u91D1\u7C92|\u7D22\u6CD5\u62C9\u91D1\u7802|\u4E1C\u975E\u91D1\u952D|\u6D17\u70BC\u91D1\u5C51|\u9524\u5236\u91D1\u7247|\u91D1\u9970\u7EBF|\u91D1\u73E0|\u91D1\u73AF|\u9EC4\u91D1\u6302\u5760|\u938F\u91D1\u6599|\u91D1\u7B94\u518C|\u91D1\u94F6\u9519\u5D4C\u6599|\u91D1\u9970\u6263"],
  ["gems", "\u5B9D\u77F3", 5, 349, "gems", "cambay bharuch galle colombo siraf", "\u9521\u5170\u84DD\u5B9D\u77F3|\u9521\u5170\u7EA2\u5B9D\u77F3|\u661F\u5149\u84DD\u5B9D\u77F3|\u5C16\u6676\u77F3|\u77F3\u69B4\u77F3|\u7EA2\u7389\u9AD3|\u739B\u7459|\u6761\u5E26\u739B\u7459|\u7F1F\u739B\u7459|\u6C34\u6676|\u7D2B\u6C34\u6676|\u9EC4\u6C34\u6676|\u7EFF\u67F1\u77F3|\u6D77\u84DD\u5B9D\u77F3|\u6708\u5149\u77F3|\u78A7\u73BA|\u77F3\u82F1\u73E0|\u7389\u9AD3\u73E0|\u96D5\u82B1\u739B\u7459|\u629B\u5149\u5B9D\u77F3\u576F"],
  ["pearls", "\u73E0\u8D1D\u4E0E\u88C5\u9970", 4, 279, "ivory-sub", "dilmun siraf hormuz qishm galle kilwa", "\u6CE2\u65AF\u6E7E\u5929\u7136\u73CD\u73E0|\u5C0F\u7C92\u6D77\u73E0|\u4E0D\u89C4\u5219\u5DF4\u6D1B\u514B\u73E0|\u7C73\u5F62\u73CD\u73E0|\u5706\u5F62\u73CD\u73E0|\u73E0\u6BCD\u8D1D\u7247|\u87BA\u94BF\u8584\u7247|\u8D1D\u58F3\u73E0|\u6D77\u87BA\u58F3|\u8D1D\u96D5\u94AE\u6263|\u73CD\u73E0\u4E32|\u73E0\u6BCD\u8D1D\u68B3|\u8D1D\u58F3\u9576\u7247|\u767D\u8776\u8D1D\u58F3|\u73CD\u73E0\u7C89|\u6D77\u8D1D\u9879\u9970"],
  ["minerals", "\u77FF\u7269\u4E0E\u77F3\u6750", 3, 86, "minerals", "alexandria ostia ephesus rhodes carthage", "\u57C3\u53CA\u96EA\u82B1\u77F3|\u767D\u5927\u7406\u77F3|\u7070\u5927\u7406\u77F3|\u77F3\u7070\u5CA9\u5757|\u82B1\u5C97\u5CA9\u5757|\u6D6E\u77F3|\u77F3\u818F\u7C89|\u719F\u77F3\u7070|\u751F\u77F3\u7070|\u706B\u5C71\u7070|\u78E8\u77F3\u576F|\u71E7\u77F3\u7247|\u5929\u7136\u91D1\u521A\u7802|\u77F3\u82F1\u7802|\u9676\u571F|\u9AD8\u5CAD\u571F|\u7EA2\u9ECF\u571F|\u767D\u57A9\u7C89|\u786B\u78FA\u5757|\u660E\u77FE\u77F3"],
  ["pigments", "\u989C\u6599\u4E0E\u7ED8\u753B", 7, 142, "pigment", "venice genoa alexandria hormuz constantinople", "\u9752\u91D1\u77F3\u989C\u6599|\u5929\u7136\u7FA4\u9752|\u77F3\u9752|\u77F3\u7EFF|\u6731\u7802|\u94C5\u767D|\u94C5\u9521\u9EC4|\u9EC4\u8D6D\u77F3|\u7EA2\u8D6D\u77F3|\u70E7\u8D6D\u77F3|\u68D5\u571F|\u9530\u8910\u989C\u6599|\u70AD\u7CBE\u9ED1|\u706F\u70DF\u9ED1|\u80ED\u8102\u8272\u6DC0|\u94DC\u7EFF|\u84DD\u94DC\u77FF\u7C89|\u86CB\u5F69\u80F6\u6599|\u52A8\u7269\u80F6\u7247|\u7ED8\u753B\u5E95\u7C89"],
  ["pottery", "\u9676\u5668", 0, 57, "pottery", "memphis ur lothal byblos", "\u5C3C\u7F57\u6CB3\u7EA2\u9676\u7F50|\u4E24\u6CB3\u50A8\u7CAE\u7F50|\u5370\u5EA6\u6CB3\u9ED1\u7ED8\u9676|\u9ECE\u51E1\u7279\u53CC\u8033\u7F50|\u9676\u5236\u6C34\u58F6|\u9676\u5236\u9152\u58F6|\u9676\u5236\u6CB9\u74F6|\u9676\u7897|\u9676\u76D8|\u9676\u676F|\u9676\u706F|\u9676\u7EBA\u8F6E|\u9676\u7F51\u5760|\u9676\u73E0|\u9676\u5C01\u6CE5|\u9676\u76D6|\u9676\u5236\u6F0F\u6597|\u9676\u5236\u6EE4\u5668|\u5C0F\u53E3\u50A8\u6C34\u7F50|\u5BBD\u53E3\u7CAE\u7F38"],
  ["classical-pottery", "\u9676\u5668", 3, 79, "pottery", "athens corinth ostia syracuse rhodes", "\u963F\u63D0\u5361\u9ED1\u7ED8\u9676\u74F6|\u963F\u63D0\u5361\u7EA2\u7ED8\u9676\u74F6|\u79D1\u6797\u65AF\u5F69\u7ED8\u9676|\u7F57\u9A6C\u7EA2\u91C9\u9676\u76D8|\u7F57\u5F97\u5C9B\u53CC\u8033\u74F6|\u538B\u5370\u9676\u7897|\u9ED1\u5F69\u9676\u676F|\u8461\u8404\u9152\u8FD0\u8F93\u9676\u575B|\u6A44\u6984\u6CB9\u8FD0\u8F93\u9676\u575B|\u9C7C\u9171\u8FD0\u8F93\u9676\u575B|\u9676\u5236\u9999\u818F\u74F6|\u9676\u5236\u70F9\u996A\u9505|\u8010\u706B\u9676\u7089|\u5F69\u9676\u706F|\u9676\u5236\u6392\u6C34\u7BA1|\u9676\u74E6\u7247|\u9A6C\u8D5B\u514B\u9676\u5757|\u9676\u5851\u5C0F\u50CF"],
  ["medieval-pottery", "\u9676\u5668", 7, 115, "pottery", "valencia malaga tunis famagusta constantinople martaban", "\u74E6\u4F26\u897F\u4E9A\u91D1\u5F69\u9676\u76D8|\u9A6C\u62C9\u52A0\u9521\u91C9\u9676|\u7A81\u5C3C\u65AF\u84DD\u7ED8\u9676|\u585E\u6D66\u8DEF\u65AF\u523B\u5212\u9676|\u62DC\u5360\u5EAD\u91C9\u9676|\u9A6C\u8FBE\u73ED\u5927\u7F38|\u6CE2\u65AF\u91C9\u9676\u7897|\u7EFF\u91C9\u6CB9\u58F6|\u84DD\u91C9\u5C0F\u74F6|\u9EC4\u91C9\u9676\u789F|\u591A\u5F69\u9676\u7816|\u9676\u5236\u836F\u7F50|\u9521\u91C9\u6C34\u7F50|\u65BD\u91C9\u708A\u9505|\u5E26\u76D6\u9676\u6C64\u76C6|\u5F69\u9676\u70DB\u53F0"],
  ["porcelain", "\u74F7\u5668", 7, 231, "porcelain", "quanzhou fuzhou ningbo hangzhou guangzhou", "\u8D8A\u7A91\u9752\u74F7\u7897|\u9F99\u6CC9\u9752\u74F7\u76D8|\u9F99\u6CC9\u9752\u74F7\u74F6|\u666F\u5FB7\u9547\u9752\u767D\u74F7|\u666F\u5FB7\u9547\u9752\u82B1\u7897|\u9752\u82B1\u5927\u76D8|\u9752\u82B1\u6267\u58F6|\u5FB7\u5316\u767D\u74F7\u676F|\u5FB7\u5316\u767D\u74F7\u74F6|\u5EFA\u7A91\u9ED1\u91C9\u76CF|\u78C1\u5DDE\u767D\u5730\u9ED1\u5F69\u7F50|\u5B9A\u7A91\u767D\u74F7\u76D8|\u5F71\u9752\u5C0F\u789F|\u9752\u74F7\u9999\u7089|\u74F7\u8D28\u6C34\u6CE8|\u9752\u82B1\u836F\u7F50|\u767D\u74F7\u6CB9\u76D2|\u74F7\u5236\u68CB\u5B50|\u74F7\u73E0|\u74F7\u5236\u5370\u6CE5\u76D2|\u9752\u82B1\u9C7C\u76C6|\u74F7\u5236\u8336\u53F6\u7F50|\u9752\u82B1\u82B1\u89DA|\u74F7\u8D28\u6C64\u5319"],
  ["later-porcelain", "\u74F7\u5668", 9, 264, "porcelain", "yuegang macao nagasaki hakata manila", "\u6F33\u5DDE\u7A91\u5916\u9500\u74F7\u76D8|\u514B\u62C9\u514B\u74F7\u5927\u76D8|\u4E94\u5F69\u74F7\u74F6|\u4E94\u5F69\u4EBA\u7269\u76D8|\u9752\u82B1\u5C71\u6C34\u7897|\u5916\u9500\u7EB9\u7AE0\u74F7|\u4F0A\u4E07\u91CC\u74F7\u7897|\u6709\u7530\u9752\u82B1\u76D8|\u65E5\u672C\u67FF\u53F3\u536B\u95E8\u74F7|\u8377\u5170\u5F0F\u74F7\u6C34\u7F50|\u9752\u82B1\u5DE7\u514B\u529B\u676F|\u74F7\u5236\u5496\u5561\u58F6|\u74F7\u5236\u7CD6\u7F50|\u5F69\u74F7\u8336\u676F|\u74F7\u5236\u5976\u7F50|\u5E26\u76D6\u74F7\u6C64\u7897"],
  ["glass", "\u73BB\u7483", 3, 129, "glass", "tyre sidon alexandria ostia", "\u9ECE\u51E1\u7279\u73BB\u7483\u73E0|\u57C3\u53CA\u84DD\u73BB\u7483|\u5439\u5236\u73BB\u7483\u676F|\u73BB\u7483\u5C0F\u9152\u74F6|\u73BB\u7483\u9999\u6C34\u74F6|\u73BB\u7483\u6CB9\u74F6|\u73BB\u7483\u7897|\u73BB\u7483\u76D8|\u5F69\u8272\u73BB\u7483\u68D2|\u73BB\u7483\u9A6C\u8D5B\u514B\u5757|\u900F\u660E\u73BB\u7483\u788E\u6599|\u7EFF\u8272\u73BB\u7483\u788E\u6599|\u73BB\u7483\u624B\u956F|\u73BB\u7483\u540A\u5760|\u73BB\u7483\u836F\u74F6|\u73BB\u7483\u706F\u76CF|\u78E8\u7802\u73BB\u7483\u5668|\u5343\u82B1\u73BB\u7483\u7247"],
  ["venetian-glass", "\u73BB\u7483", 7, 179, "glass", "venice antwerp amsterdam genoa", "\u7A46\u62C9\u8BFA\u900F\u660E\u73BB\u7483|\u5A01\u5C3C\u65AF\u9AD8\u811A\u676F|\u5F69\u4E1D\u73BB\u7483\u676F|\u4E73\u767D\u73BB\u7483\u7897|\u84DD\u8272\u73BB\u7483\u73E0\u4E32|\u955C\u7247\u73BB\u7483|\u5E73\u677F\u7A97\u73BB\u7483|\u5F69\u7ED8\u7A97\u7247|\u73BB\u7483\u6C99\u6F0F|\u73BB\u7483\u6C34\u74F6|\u73BB\u7483\u84B8\u998F\u5668|\u73BB\u7483\u6F0F\u6597|\u73BB\u7483\u8BD5\u836F\u74F6|\u73BB\u7483\u706F\u7F69|\u523B\u82B1\u73BB\u7483\u676F|\u9576\u5D4C\u73BB\u7483\u73E0"],
  ["paper", "\u7EB8\u4E0E\u4E66\u5199", 7, 83, "paper", "hangzhou fuzhou yangzhou ningbo guangzhou", "\u7AF9\u7EB8|\u6851\u76AE\u7EB8|\u696E\u76AE\u7EB8|\u9EBB\u7EB8|\u76AE\u7EB8|\u68C9\u7EB8|\u767D\u5BA3\u7EB8|\u67D3\u8272\u7B3A\u7EB8|\u82B1\u7B3A|\u6CB9\u7EB8|\u9632\u6F6E\u5305\u88C5\u7EB8|\u7EB8\u4F1E\u9762|\u7EB8\u6247\u9762|\u6728\u523B\u5370\u4E66\u7EB8|\u8D26\u518C\u7EB8|\u4FE1\u5C01\u7EB8|\u7EB8\u7EF3|\u786C\u7EB8\u5323|\u7EB8\u6D46\u997C|\u523B\u5370\u796D\u7940\u7EB8"],
  ["writing", "\u7EB8\u4E0E\u4E66\u5199", 3, 78, "writing", "alexandria memphis ostia athens ephesus", "\u57C3\u53CA\u7EB8\u8349\u5377|\u7EB8\u8349\u5355\u9875|\u4E66\u5199\u6728\u677F|\u6D82\u8721\u677F|\u7F8A\u76AE\u7EB8|\u8584\u728A\u76AE\u7EB8|\u82A6\u82C7\u7B14|\u9752\u94DC\u7B14\u5C16|\u70AD\u9ED1\u58A8|\u94C1\u80C6\u58A8|\u7EA2\u8272\u4E66\u5199\u58A8|\u58A8\u7C89|\u58A8\u6C34\u9676\u74F6|\u4E66\u5199\u677F\u8721|\u82A6\u82C7\u7B14\u7BA1|\u6728\u5236\u7B14\u76D2|\u7F8A\u76AE\u5377\u8F74\u5E26|\u6284\u5199\u7528\u5C3A"],
  ["books", "\u4E66\u7C4D\u4E0E\u77E5\u8BC6", 8, 171, "books", "venice antwerp london amsterdam genoa lisbon", "\u5546\u7528\u7B97\u672F\u4E66|\u590D\u5F0F\u8BB0\u8D26\u624B\u518C|\u6CBF\u5CB8\u822A\u8DEF\u5FD7|\u6E2F\u53E3\u7A0E\u5219\u518C|\u8239\u5320\u624B\u518C|\u8349\u6728\u56FE\u9274|\u77FF\u7269\u56FE\u9274|\u5929\u6587\u5386\u8868|\u6F6E\u6C50\u8868\u518C|\u5546\u8D38\u8BCD\u6C47\u8868|\u5EA6\u91CF\u8861\u6362\u7B97\u518C|\u822A\u6D77\u65E5\u5FD7\u7A7A\u518C|\u8D27\u7269\u603B\u8D26\u7C3F|\u4FDD\u9669\u5951\u7EA6\u7EB8\u672C|\u6D77\u56FE\u96C6|\u661F\u56FE\u9875|\u7ECF\u7EAC\u6D4B\u7B97\u8868|\u5370\u5237\u5B57\u4F53\u6837\u518C"],
  ["asian-writing", "\u7EB8\u4E0E\u4E66\u5199", 7, 106, "paper", "hangzhou nanjing fuzhou busan hakata", "\u677E\u70DF\u58A8\u952D|\u6CB9\u70DF\u58A8\u952D|\u6731\u58A8\u952D|\u6BDB\u7B14|\u72FC\u6BEB\u7B14|\u7F8A\u6BEB\u7B14|\u781A\u77F3\u576F|\u7AEF\u781A|\u6B59\u781A|\u6728\u96D5\u7248|\u5370\u6CE5|\u7BC6\u523B\u77F3|\u7AF9\u7B80\u523B\u5B57\u6599|\u4E66\u753B\u88C5\u88F1\u7EEB|\u5377\u8F74\u6728\u6746|\u7EBF\u88C5\u4E66\u5C01\u76AE|\u6587\u4E66\u6728\u5323|\u7B14\u7B52"],
  ["navigation", "\u822A\u6D77\u5668\u5177", 8, 183, "navigation", "lisbon seville venice amsterdam antwerp london", "\u78C1\u7F57\u76D8|\u8239\u7528\u7F57\u7ECF\u76D8|\u7F57\u76D8\u78C1\u9488|\u9EC4\u94DC\u661F\u76D8|\u6728\u5236\u5341\u5B57\u6D4B\u5929\u4EEA|\u8C61\u9650\u4EEA|\u94C5\u5236\u6D4B\u6DF1\u9524|\u6807\u7ED3\u6D4B\u901F\u7EF3|\u6D4B\u6DF1\u7EF3|\u534A\u65F6\u6C99\u6F0F|\u56DB\u65F6\u6C99\u6F0F|\u6D77\u56FE\u5206\u89C4|\u9EC4\u94DC\u76F4\u5C3A|\u7ED8\u56FE\u5706\u89C4|\u822A\u6D77\u7B97\u76D8|\u6728\u5236\u98CE\u5411\u6807|\u89C2\u661F\u7784\u51C6\u5C3A|\u6E2F\u53E3\u706F\u7B3C|\u9632\u98CE\u6CB9\u706F|\u6D4B\u8DDD\u94FE"],
  ["ship-rigging", "\u8239\u7528\u5668\u6750", 6, 109, "rigging", "genoa venice bergen hamburg bristol riga", "\u6A61\u6728\u6ED1\u8F6E|\u6986\u6728\u7EDE\u76D8|\u8239\u7528\u7EDE\u76D8\u8F74|\u5E06\u6841\u6728|\u6845\u9876\u5706\u76D8|\u7D22\u5177\u6728\u6263|\u7F06\u7EF3\u6728\u6869|\u94C1\u5236\u5378\u6263|\u94C1\u5236\u94FE\u73AF|\u5E06\u5E03\u8865\u7247|\u8239\u5E06\u7F1D\u7EBF|\u7F1D\u5E06\u9488|\u586B\u7F1D\u9EBB\u7D6E|\u9632\u6C34\u7126\u6CB9\u6876|\u8239\u4F53\u6CA5\u9752\u6876|\u8231\u53E3\u6728\u76D6|\u8239\u8235\u94F0\u94FE|\u8239\u6868|\u5907\u7528\u8235\u67C4|\u6728\u5236\u8200\u6C34\u6597"],
  ["tools", "\u624B\u5DE5\u5DE5\u5177", 6, 94, "iron", "stockholm hamburg antwerp sakai bristol", "\u6728\u5DE5\u5228|\u6728\u5DE5\u51FF|\u5F13\u952F|\u624B\u952F|\u5F00\u69FD\u952F|\u62C9\u94BB|\u624B\u6447\u94BB|\u5706\u89C4\u952F|\u6728\u5DE5\u9524|\u77F3\u5320\u9524|\u94C1\u5320\u7827|\u953B\u9020\u94B3|\u6728\u67C4\u65A7|\u5288\u67F4\u65A7|\u951B\u65A7|\u9570\u5200\u576F|\u4FEE\u679D\u94A9\u5200|\u526A\u7F8A\u6BDB\u526A|\u88C1\u5E03\u526A|\u76AE\u9769\u51B2\u5B50|\u9525\u5B50|\u78E8\u5200\u77F3|\u7EC6\u78E8\u6CB9\u77F3|\u94C1\u5236\u522E\u5200"],
  ["household", "\u65E5\u7528\u5668\u5177", 6, 77, "household", "genoa venice barcelona ragusa naples", "\u94DC\u5236\u6C64\u9505|\u9EC4\u94DC\u6C34\u58F6|\u9521\u5236\u9152\u676F|\u9521\u76D8|\u94C1\u5236\u70DB\u53F0|\u94DC\u6CB9\u706F|\u6728\u5236\u9910\u76D8|\u6728\u52FA|\u6728\u53C9|\u9EC4\u94DC\u52FA|\u9AA8\u67C4\u5C0F\u5200|\u6728\u68B3|\u9AA8\u68B3|\u94DC\u955C|\u6728\u76C6|\u6728\u6876|\u94C1\u7B8D\u6C34\u6876|\u6728\u5236\u63D0\u7BB1|\u6728\u5236\u79E4\u6746|\u94DC\u5236\u5929\u5E73|\u9676\u5236\u6F0F\u52FA|\u9EC4\u94DC\u95E8\u9501"],
  ["containers", "\u5305\u88C5\u4E0E\u5BB9\u5668", 3, 53, "containers", "ostia alexandria carthage rhodes byblos", "\u6A61\u6728\u9152\u6876|\u677E\u6728\u8D27\u7BB1|\u67F3\u6761\u7B50|\u82A6\u82C7\u7B50|\u68D5\u6988\u53F6\u8D27\u7BEE|\u9EBB\u5E03\u8D27\u888B|\u76AE\u9769\u4FE1\u888B|\u9676\u5236\u5C01\u53E3\u74F6|\u8702\u8721\u5C01\u74F6\u6599|\u6811\u8102\u5C01\u7F50\u6599|\u6728\u6876\u7B8D|\u94C1\u6876\u7B8D|\u9676\u575B\u8349\u5957|\u8349\u7EF3\u6346\u624E\u5E26|\u4E9A\u9EBB\u5305\u5E03|\u8D27\u7269\u5C01\u6CE5\u5370|\u9EC4\u94DC\u79E4\u76D8|\u77F3\u5236\u781D\u7801"],
  ["furniture", "\u5BB6\u5177", 8, 153, "furniture", "venice genoa amsterdam london lisbon", "\u6A61\u6728\u50A8\u7269\u7BB1|\u80E1\u6843\u6728\u4E66\u7BB1|\u6298\u53E0\u6728\u51F3|\u85E4\u7F16\u6905|\u76AE\u9762\u51F3|\u6728\u5236\u822A\u6D77\u684C|\u9EC4\u94DC\u5305\u89D2\u7BB1|\u5D4C\u6728\u9996\u9970\u5323|\u955C\u6846|\u6728\u5236\u8863\u67B6|\u5C0F\u578B\u5E8A\u67B6|\u96D5\u82B1\u6728\u6258\u76D8|\u6728\u683C\u4E66\u67B6|\u8239\u8231\u6298\u53E0\u684C|\u5E10\u518C\u62BD\u5C49\u67DC|\u70DB\u53F0\u6728\u5EA7"],
  ["textile-crafts", "\u670D\u9970\u4E0E\u624B\u5DE5", 8, 135, "clothcraft", "bruges antwerp venice genoa ragusa", "\u4F5B\u5170\u5FB7\u65AF\u82B1\u8FB9|\u9488\u7EC7\u889C|\u6BDB\u5462\u515C\u5E3D|\u4E9A\u9EBB\u886C\u8863|\u76AE\u9769\u56F4\u88D9|\u8239\u5458\u5E06\u5E03\u88E4|\u7EE3\u82B1\u8170\u5E26|\u7F16\u7EC7\u675F\u5E26|\u4E1D\u8D28\u9886\u5DFE|\u624B\u5DE5\u9488\u7EBF\u5305|\u9EC4\u94DC\u8863\u6263|\u8D1D\u58F3\u8863\u6263|\u9AA8\u5236\u8863\u6263|\u5305\u5E03\u7EBD\u6263|\u670D\u88C5\u94DC\u94A9|\u7EE3\u82B1\u684C\u5DFE|\u4E9A\u9EBB\u9910\u5DFE|\u9488\u7EC7\u624B\u5957|\u5E03\u5236\u94B1\u888B|\u6BDB\u6BE1\u978B\u57AB"],
  ["asian-crafts", "\u6F06\u5668\u4E0E\u624B\u5DE5", 7, 150, "lacquer", "guangzhou quanzhou ningbo hakata sakai naha", "\u9ED1\u6F06\u7897|\u6731\u6F06\u76D8|\u87BA\u94BF\u6F06\u76D2|\u63CF\u91D1\u6F06\u76D2|\u6F06\u6728\u6258\u76D8|\u6F06\u5668\u8336\u7B52|\u6F06\u6728\u68B3\u76D2|\u7AF9\u7F16\u98DF\u76D2|\u96D5\u7AF9\u7B14\u7B52|\u7AF9\u9AA8\u6298\u6247|\u56E2\u6247|\u6CB9\u7EB8\u4F1E|\u6728\u5236\u68CB\u76D8|\u6728\u96D5\u68CB\u5B50|\u9AA8\u5236\u9AB0\u5B50|\u9676\u5236\u68CB\u5B50|\u6728\u7248\u5E74\u753B|\u7AF9\u7F16\u8336\u7B5B|\u68D5\u7F16\u84D1\u8863|\u7AF9\u5236\u7BA9\u7B50"],
  ["perfume-soap", "\u9999\u6C1B\u4E0E\u7682\u6599", 7, 140, "perfume", "marseille venice alexandria smyrna sidon", "\u9A6C\u8D5B\u6A44\u6984\u6CB9\u7682|\u963F\u52D2\u9887\u6708\u6842\u7682|\u8F6F\u7682\u818F|\u6D17\u8863\u7682\u5757|\u73AB\u7470\u6C34|\u6A59\u82B1\u6C34|\u85B0\u8863\u8349\u6C34|\u8FF7\u8FED\u9999\u6C34|\u73AB\u7470\u9999\u818F|\u8309\u8389\u9999\u818F|\u9999\u8349\u53D1\u6CB9|\u674F\u4EC1\u6DA6\u80A4\u818F|\u9999\u56CA\u586B\u6599|\u9999\u6728\u68B3\u6CB9|\u6D17\u6DA4\u8349\u6728\u7070|\u7682\u89D2\u5E72\u835A|\u6D74\u7528\u6D6E\u77F3|\u9999\u8721\u70DB"],
  ["musical-crafts", "\u4E50\u5668\u4E0E\u88C5\u9970", 8, 174, "crafts", "venice genoa constantinople seville", "\u9C81\u7279\u7434|\u5C0F\u63D0\u7434|\u7AD6\u7B1B|\u6728\u5236\u6A2A\u7B1B|\u624B\u9F13|\u94C3\u9F13|\u9EC4\u94DC\u94C3|\u8239\u949F|\u5F26\u4E50\u5668\u80A0\u5F26|\u7434\u5F13\u6728\u6599|\u62E8\u5F26\u7247|\u9F13\u76AE|\u4E50\u8C31\u7EB8\u672C|\u5F69\u7ED8\u6728\u9762\u5177|\u96D5\u6728\u5723\u50CF|\u94DC\u5236\u5C0F\u50CF|\u9EC4\u94DC\u76F8\u6846|\u523A\u7EE3\u65D7\u5E1C"],
  ["beads-jewels", "\u73E0\u9970\u4E0E\u5DE5\u827A", 8, 186, "gems", "venice cambay nagasaki elmina acapulco", "\u5A01\u5C3C\u65AF\u5F69\u73E0|\u574E\u8D1D\u7EA2\u7389\u9AD3\u73E0|\u5207\u9762\u73BB\u7483\u73E0|\u7409\u7483\u7BA1\u73E0|\u9540\u91D1\u94DC\u73E0|\u94F6\u4E1D\u8033\u73AF|\u94DC\u5236\u624B\u73AF|\u739B\u7459\u6212\u9762|\u6C34\u6676\u6302\u5760|\u8D1D\u73E0\u4E32|\u91D1\u7B94\u73BB\u7483\u73E0|\u84DD\u73BB\u7483\u773C\u73E0|\u73D0\u7405\u540A\u5760|\u73D0\u7405\u80F8\u9488|\u94F6\u9970\u53D1\u7C2A|\u73E0\u6BCD\u8D1D\u53D1\u68B3|\u9EC4\u94DC\u9879\u94FE|\u94F6\u7EBF\u82B1\u9970"],
  ["agricultural-tools", "\u519C\u5177\u4E0E\u79CD\u5B50", 7, 79, "farmtools", "gdansk hamburg bordeaux yangzhou hangzhou", "\u94C1\u5236\u9504\u5203|\u94C1\u5236\u94F2\u5934|\u6728\u67C4\u8019|\u6728\u5236\u7281\u8EAB|\u8C37\u7269\u7B5B|\u626C\u8C37\u7C38\u7B95|\u64AD\u79CD\u888B|\u9EBB\u7EF3\u7272\u755C\u7B3C\u5934|\u9570\u5200\u78E8\u77F3|\u6728\u5236\u6C34\u8F6E\u914D\u4EF6|\u704C\u6E89\u9676\u7BA1|\u8702\u7BB1\u6728\u677F|\u56ED\u827A\u526A|\u679C\u6811\u5AC1\u63A5\u5200|\u4E9A\u9EBB\u64AD\u79CD\u7C7D|\u5927\u9EBB\u64AD\u79CD\u7C7D|\u83DC\u7C7D\u79CD|\u841D\u535C\u7C7D|\u82A5\u83DC\u7C7D\u79CD|\u846B\u82A6\u7C7D"],
  ["gardens", "\u56ED\u827A\u7269\u4EA7", 8, 69, "garden", "lisbon seville valencia funchal galle cochin", "\u5E72\u67E0\u6AAC\u7247|\u5E72\u6A59\u76AE|\u82E6\u6A59\u679C\u76AE|\u67D1\u6A58\u7C7D|\u65E0\u82B1\u679C\u63D2\u679D|\u6A44\u6984\u63D2\u7A57|\u8461\u8404\u679D\u6761|\u67A3\u6930\u5E7C\u82D7|\u69DF\u6994\u5E72|\u69DF\u6994\u53F6\u5305\u6599|\u83B2\u5B50\u5E72|\u767E\u5408\u5E72|\u828B\u5934\u5E72|\u83E0\u841D\u679C\u5E72|\u8292\u679C\u5E72|\u9999\u8549\u5E72|\u9178\u6A59\u6C41|\u67D1\u6A58\u871C\u996F|\u73AB\u7470\u82B1\u857E|\u8309\u8389\u82B1\u82DE"],
  ["preserves", "\u8239\u7528\u98DF\u54C1", 9, 58, "provisions", "boston bristol london amsterdam hamburg havana", "\u53CC\u70E4\u8239\u997C|\u9ED1\u9EA6\u786C\u997C|\u71D5\u9EA6\u8239\u7CAE|\u76D0\u814C\u725B\u8089|\u76D0\u814C\u732A\u8089|\u98CE\u5E72\u706B\u817F|\u70DF\u718F\u8089\u7247|\u786C\u8D28\u5976\u916A|\u7F8A\u4E73\u5E72\u916A|\u9EC4\u6CB9\u9676\u7F50|\u8C4C\u8C46\u6C64\u6599|\u814C\u5377\u5FC3\u83DC|\u76D0\u6E0D\u841D\u535C|\u82F9\u679C\u5E72\u888B|\u8461\u8404\u5E72\u8865\u7ED9\u5305|\u67E0\u6AAC\u7CD6\u6D46|\u5927\u9EA6\u6C64\u6599|\u538B\u5B9E\u71D5\u9EA6\u997C|\u814C\u9EC4\u74DC|\u6885\u5B50\u9171"],
  ["baltic-natural", "\u6797\u5730\u7269\u4EA7", 6, 85, "forest", "riga novgorod visby gdansk stockholm bergen", "\u6CE2\u7F57\u7684\u6D77\u7425\u73C0|\u539F\u77F3\u7425\u73C0|\u629B\u5149\u7425\u73C0\u73E0|\u7425\u73C0\u788E\u6599|\u677E\u6811\u8102|\u4E91\u6749\u6811\u8102|\u767D\u6866\u83CC\u5E72|\u5E72\u8611\u83C7|\u91CE\u8393\u5E72|\u675C\u677E\u6728\u7247|\u6A61\u6811\u76AE|\u6866\u6811\u76AE\u5377|\u9E7F\u89D2\u5DE5\u827A\u6599|\u9AA8\u7247\u576F|\u9AA8\u9488|\u9AA8\u5236\u7EBA\u8F6E|\u677E\u660E|\u6811\u76AE\u7F16\u76D2"],
  ["south-seas", "\u6D77\u5C9B\u7269\u4EA7", 8, 91, "island", "brunei makassar manila naha banda ternate", "\u85E4\u68D5\u7EA4\u7EF4|\u8549\u9EBB\u539F\u675F|\u8549\u9EBB\u7EF3|\u897F\u7C73\u7C89|\u897F\u7C73\u7C92|\u5E72\u9762\u5305\u679C|\u68D5\u6988\u7CD6\u997C|\u6930\u7CD6\u5757|\u6D77\u5C9B\u8702\u8721|\u8D1D\u5236\u9C7C\u94A9|\u7AF9\u5236\u9C7C\u7B3C|\u6728\u5236\u6D6E\u6807|\u84B2\u8349\u5E2D|\u9732\u515C\u53F6\u7F16\u5305|\u9999\u8305\u675F|\u5E72\u9AD8\u826F\u59DC|\u68D5\u53F6\u6247|\u87BA\u58F3\u94AE\u6599"],
  ["merchant-supplies", "\u5546\u4F1A\u7528\u54C1", 8, 116, "merchant", "venice genoa antwerp amsterdam lisbon london", "\u9EC4\u94DC\u5546\u4F1A\u5370\u7AE0|\u5C01\u8721\u68D2|\u6731\u7EA2\u5C01\u8721|\u5929\u7136\u866B\u80F6|\u7D2B\u80F6\u7247|\u8D26\u623F\u7B97\u76D8|\u786C\u6728\u7B97\u7B79|\u94DC\u8D28\u7B79\u7801|\u94C1\u5236\u94B1\u7BB1|\u5C0F\u578B\u94F6\u79E4|\u6298\u53E0\u6746\u79E4|\u5957\u53E0\u94DC\u781D\u7801|\u9EC4\u94DC\u8D27\u7B7E|\u76AE\u5C01\u8D26\u672C|\u7F8A\u76AE\u5951\u7EA6\u5939|\u6728\u5236\u6D77\u56FE\u7B52|\u9632\u6C34\u4FE1\u7B52|\u7801\u5934\u540A\u79E4|\u8D27\u7269\u9A8C\u6837\u52FA|\u94A5\u5319\u576F"]
];
var colors = {
  \u7CAE\u98DF: "#c9ae6c",
  \u98DF\u54C1: "#bfa26d",
  \u6E14\u4EA7: "#8db1b2",
  \u9152\u996E: "#b18476",
  \u6728\u6750: "#8da17a",
  \u91D1\u5C5E: "#b59b85",
  \u74F7\u5668: "#b8cecb",
  \u9676\u5668: "#c19778",
  \u9999\u6599: "#b7a177",
  \u67D3\u6599: "#a593b4",
  \u8D35\u91D1\u5C5E: "#c9bd93",
  \u5B9D\u77F3: "#8bb6ad"
};
var laterStyles = {
  "\u658B\u6D66\u5C14\u523B\u82B1\u77F3\u7897": 10,
  "\u68AD\u7F57\u8721\u67D3\u5E03": 10,
  "\u54C8\u52D2\u5C14\u5496\u5561\u751F\u8C46": 8,
  "\u8D21\u5FB7\u5C14\u68C9\u62AB\u80A9": 9,
  "\u963F\u6563\u8482\u6728\u68B3": 9,
  "\u5317\u4EAC\u666F\u6CF0\u84DD\u5C0F\u76D2": 8,
  "\u6B66\u5937\u5CA9\u8336": 9,
  "\u677E\u841D\u7092\u9752\u8336": 8,
  "\u73E0\u5F62\u7EFF\u8336": 9,
  "\u666F\u5FB7\u9547\u9752\u82B1\u7897": 7,
  "\u9752\u82B1\u5927\u76D8": 7,
  "\u9752\u82B1\u6267\u58F6": 7,
  "\u5FB7\u5316\u767D\u74F7\u676F": 8,
  "\u5FB7\u5316\u767D\u74F7\u74F6": 8,
  "\u5916\u9500\u7EB9\u7AE0\u74F7": 10,
  "\u65E5\u672C\u67FF\u53F3\u536B\u95E8\u74F7": 9,
  "\u82B1\u751F\u6CB9": 8,
  "\u83E0\u841D\u679C\u5E72": 8
};
var extendedGoods = rows3.flatMap(
  ([slug, category, era, base, familyId, sourcePorts, names]) => names.split("|").map((name, index) => ({
    id: `catalog-${slug}-${index.toString(36)}`,
    name,
    icon: name[0],
    category,
    familyId,
    era: Math.max(era, laterStyles[name] ?? 0),
    // Within-family values reflect distinct material/processing forms. They are
    // balance constants, not historical price quotations or quality grades.
    base: Math.max(12, Math.round(base * (0.74 + (index * 7 + slug.length) % 15 * 0.045))),
    color: colors[category] ?? "#aeaa89",
    unit: "\u7BB1",
    originPortIds: sourcePorts.split(" "),
    description: `${category} \xB7 ${name}\u3002\u6309\u4E00\u7BB1\u6807\u51C6\u8D27\u91CF\u4EA4\u6613\uFF1B\u5386\u53F2\u6750\u6599\u4E0E\u624B\u5DE5\u5F62\u5236\u7ECF\u7ECF\u8425\u73A9\u6CD5\u5F52\u5E76\u3002`
  }))
);

// src/catalog/markets.ts
var hash = (value) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index++) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
};
var originHints = [
  [/埃及|尼罗河/, ["memphis", "alexandria"]],
  [/两河/, ["ur", "basra"]],
  [/迪尔蒙/, ["dilmun"]],
  [/阿曼|马干/, ["magAN", "sohar", "muscat"]],
  [/印度河/, ["lothal"]],
  [/黎凡特|黎巴嫩|叙利亚/, ["byblos", "sidon", "tyre", "ugarit", "arwad", "akka", "jaffa"]],
  [/克里特/, ["crete"]],
  [/罗得岛/, ["rhodes"]],
  [/西西里/, ["syracuse", "palermo", "messina"]],
  [/阿提卡/, ["athens"]],
  [/科林斯/, ["corinth"]],
  [/罗马|坎帕尼亚/, ["ostia", "naples"]],
  [/黑海|克里米亚/, ["chersonesus", "caffa", "sinope"]],
  [/突尼斯|北非/, ["tunis", "carthage", "tripoli"]],
  [/波斯|海湾/, ["dilmun", "siraf", "hormuz", "qishm"]],
  [/锡兰/, ["galle", "colombo"]],
  [/马拉巴尔|卡利卡特/, ["calicut", "cochin", "muziris", "quilon"]],
  [/古吉拉特|坎贝/, ["cambay", "bharuch", "surat"]],
  [/苏拉特/, ["surat"]],
  [/孟加拉/, ["chittagong", "satgaon"]],
  [/科罗曼德尔/, ["masulipatnam", "pulicat", "nagapattinam"]],
  [/马达班|缅甸/, ["martaban", "pegu"]],
  [/福建|福州|建州|德化|建窑|漳州/, ["fuzhou", "quanzhou", "yuegang"]],
  [/浙江|宁波|明州/, ["ningbo", "hangzhou"]],
  [/江南|绍兴|龙泉|越窑|北苑/, ["hangzhou", "ningbo", "fuzhou"]],
  [/岭南/, ["guangzhou"]],
  [/日本|伊万里|有田|柿右卫门/, ["nagasaki", "hakata", "sakai"]],
  [/琉球/, ["naha"]],
  [/马六甲/, ["malacca"]],
  [/巴鲁斯/, ["barus"]],
  [/苏门答腊/, ["palembang", "barus", "aceh"]],
  [/婆罗洲/, ["brunei"]],
  [/亚齐/, ["aceh"]],
  [/万丹/, ["banten"]],
  [/爪哇/, ["batavia", "banten", "gresik"]],
  [/班达/, ["banda"]],
  [/特尔纳特|蒂多雷/, ["ternate"]],
  [/占城/, ["hoi-an"]],
  [/苏拉威西/, ["makassar"]],
  [/摩卡|也门/, ["mocha", "aden"]],
  [/哈德拉毛/, ["qana", "aden"]],
  [/索马里|哈拉尔/, ["mogadishu", "adulis", "massawa"]],
  [/索法拉|东非/, ["sofala", "kilwa", "mozambique"]],
  [/几内亚|黄金海岸/, ["elmina", "accra", "benin", "bonny"]],
  [/威尼斯|穆拉诺/, ["venice"]],
  [/热那亚/, ["genoa"]],
  [/佛兰德斯/, ["bruges", "antwerp"]],
  [/拜占庭/, ["constantinople"]],
  [/塞浦路斯/, ["famagusta", "salamis"]],
  [/马赛/, ["marseille"]],
  [/瓦伦西亚/, ["valencia"]],
  [/马拉加/, ["malaga"]],
  [/波尔多/, ["bordeaux"]],
  [/杜罗河|葡萄牙/, ["porto", "lisbon"]],
  [/马德拉/, ["funchal"]],
  [/加那利/, ["las-palmas"]],
  [/里斯本/, ["lisbon"]],
  [/英格兰|不列颠/, ["bristol", "london", "plymouth"]],
  [/苏格兰/, ["edinburgh"]],
  [/爱尔兰/, ["dublin"]],
  [/挪威|卑尔根/, ["bergen"]],
  [/瑞典/, ["stockholm"]],
  [/俄国|俄罗斯/, ["novgorod", "riga"]],
  [/汉堡/, ["hamburg"]],
  [/不来梅/, ["bremen"]],
  [/吕贝克|吕讷堡/, ["lubeck"]],
  [/格但斯克|维斯瓦/, ["gdansk"]],
  [/波罗的海|波美拉尼亚/, ["riga", "gdansk", "visby", "lubeck", "tallinn", "stockholm"]],
  [/加勒比|牙买加/, ["havana", "santo-domingo", "port-royal", "san-juan"]],
  [/墨西哥|中美洲|危地马拉/, ["veracruz", "acapulco"]],
  [/安第斯/, ["callao"]],
  [/厄瓜多尔|瓜亚基尔/, ["guayaquil"]],
  [/巴西|伯南布哥/, ["salvador", "recife", "rio"]],
  [/加拿大/, ["quebec"]],
  [/北美/, ["quebec", "new-amsterdam", "boston"]]
];
function createMarketCatalog(ports2, goods2) {
  const portIndex = new Map(ports2.map((p) => [p.id, p]));
  const goodIndex = new Map(goods2.map((g) => [g.id, g]));
  const catalogs = new Map(ports2.map((p) => [p.id, /* @__PURE__ */ new Set()]));
  const add = (port2, goodId) => catalogs.get(port2.id).add(goodId);
  const size = (port2) => catalogs.get(port2.id).size;
  const preferSpace = (candidates, goodId) => [...candidates].sort(
    (a, b) => size(a) - size(b) || hash(`${a.id}:${goodId}`) - hash(`${b.id}:${goodId}`)
  );
  for (const p of ports2) {
    for (const id of ["grain", "salt", "linen", "copper", "cedar", "pottery", ...p.produces, ...p.demands]) {
      if (goodIndex.has(id)) add(p, id);
    }
  }
  for (const g of goods2.filter((item) => item.originPortIds)) {
    const namedOrigin = originHints.find(([pattern]) => pattern.test(g.name));
    const declared = g.originPortIds.map((id) => portIndex.get(id)).filter((p) => Boolean(p));
    const hinted = namedOrigin?.[1].map((id) => portIndex.get(id)).filter((p) => Boolean(p)) ?? [];
    const candidates = hinted.length ? hinted : declared;
    if (!candidates.length) throw new Error(`No source port for ${g.id}`);
    const availableCandidates = candidates.filter((p) => p.era <= g.era);
    const source = preferSpace(availableCandidates.length ? availableCandidates : candidates, g.id)[0];
    g.era = Math.max(g.era, source.era);
    g.originPortIds = [source.id];
    g.originRegions = [source.region];
    g.description = `${g.category} \xB7 ${source.name}\u53CA\u5176\u8179\u5730\u4F9B\u8D27\u3002${g.name}\u4EE5\u4E00\u7BB1\u6807\u51C6\u8D27\u91CF\u4EA4\u6613\uFF0C\u54C1\u7C7B\u6309\u5386\u53F2\u6750\u6599\u4E0E\u624B\u5DE5\u5F62\u5236\u5F52\u5E76\u3002`;
    add(source, g.id);
    if (!source.produces.includes(g.id)) source.produces.push(g.id);
  }
  for (const g of goods2.filter((item) => item.originPortIds)) {
    const source = portIndex.get(g.originPortIds[0]);
    const candidates = ports2.filter((p) => p.id !== source.id && p.era <= Math.max(8, g.era) && size(p) < 58);
    const familyBuyers = candidates.filter((p) => p.demands.includes(g.familyId ?? ""));
    const sameSea = candidates.filter((p) => p.basin === source.basin);
    const buyer = preferSpace(familyBuyers.length ? familyBuyers : sameSea.length ? sameSea : candidates, g.id)[0];
    if (buyer) {
      add(buyer, g.id);
      if (!buyer.demands.includes(g.id)) buyer.demands.push(g.id);
    }
  }
  for (const p of ports2) {
    if (size(p) >= 28) continue;
    const regional = goods2.filter((g) => g.originPortIds?.some((id) => portIndex.get(id)?.basin === p.basin));
    regional.sort((a, b) => hash(`${p.id}:${a.id}`) - hash(`${p.id}:${b.id}`));
    for (const g of regional) {
      if (size(p) >= 28) break;
      if (catalogs.get(p.id).has(g.id)) continue;
      add(p, g.id);
      p.demands.push(g.id);
    }
  }
  return new Map(ports2.map((p) => [p.id, [...catalogs.get(p.id)].map((id) => goodIndex.get(id)).sort(
    (a, b) => Number(p.produces.includes(b.id)) - Number(p.produces.includes(a.id)) || a.era - b.era || a.name.localeCompare(b.name, "zh-CN")
  )]));
}

// src/data.ts
var eras = [
  [
    "river",
    "\u6CB3\u53E3\u4E0E\u6D77\u6E7E\u8D38\u6613",
    "\u524D 3000 \u2014 \u524D 1800",
    "\u5C3C\u7F57\u6CB3\u3001\u4E24\u6CB3\u4E0E\u5370\u5EA6\u6CB3\u7684\u65E9\u671F\u8D38\u6613",
    "\u6728\u5E06\u8239 \xB7 \u6807\u51C6\u5EA6\u91CF",
    0,
    -3e3,
    "\u6CB3\u53E3\u5E06\u8239"
  ],
  [
    "bronze",
    "\u9752\u94DC\u6D77\u8DEF",
    "\u524D 1800 \u2014 \u524D 1200",
    "\u94DC\u9521\u3001\u9ECE\u51E1\u7279\u6728\u6750\u4E0E\u7231\u7434\u6D77\u6E2F\u90A6",
    "\u7F1D\u5408\u6728\u8239 \xB7 \u5B63\u98CE\u89C2\u5BDF",
    3e3,
    -1800,
    "\u9752\u94DC\u65F6\u4EE3\u5546\u8239"
  ],
  [
    "iron",
    "\u94C1\u5668\u4E0E\u57CE\u90A6",
    "\u524D 1200 \u2014 \u524D 600",
    "\u8153\u5C3C\u57FA\u5546\u4EBA\u4E0E\u5730\u4E2D\u6D77\u8D38\u6613\u636E\u70B9",
    "\u6868\u5E06\u8239 \xB7 \u6E2F\u53E3\u5173\u7A0E",
    8500,
    -1200,
    "\u53CC\u6845\u6868\u5E06\u5546\u8239"
  ],
  [
    "classical",
    "\u53E4\u5178\u5E1D\u56FD\u5546\u8DEF",
    "\u524D 600 \u2014 \u516C\u5143 200",
    "\u5730\u4E2D\u6D77\u3001\u7EA2\u6D77\u4E0E\u5370\u5EA6\u6D0B\u5546\u8DEF",
    "\u8FDC\u6D0B\u5E06\u6868\u8239 \xB7 \u62A4\u822A",
    22e3,
    -600,
    "\u53E4\u5178\u8FDC\u6D0B\u5546\u8239"
  ],
  [
    "late-antique",
    "\u665A\u53E4\u4EE3\u6D77\u7F51",
    "200 \u2014 700",
    "\u62DC\u5360\u5EAD\u3001\u8428\u73CA\u4E0E\u4E1C\u975E\u6D77\u5CB8",
    "\u5B63\u98CE\u5386\u6CD5 \xB7 \u6D77\u4E0A\u9A7F\u7AD9",
    65e3,
    200,
    "\u665A\u53E4\u4EE3\u6D77\u8239"
  ],
  [
    "monsoon",
    "\u5B63\u98CE\u5546\u7F51",
    "700 \u2014 1000",
    "\u963F\u62C9\u4F2F\u6D77\u4E0E\u5510\u4EE3\u6E2F\u53E3",
    "\u4E09\u89D2\u5E06 \xB7 \u5546\u4E1A\u7968\u636E",
    15e4,
    700,
    "\u4E09\u89D2\u5E06\u8FDC\u6D0B\u8239"
  ],
  [
    "medieval",
    "\u4E2D\u4E16\u7EAA\u8FDC\u6D0B",
    "1000 \u2014 1300",
    "\u5B8B\u4EE3\u6D77\u8D38\u4E0E\u5370\u5EA6\u6D0B\u822A\u7EBF",
    "\u6D77\u8239\u6C34\u5BC6\u8231 \xB7 \u822A\u6D77\u7F57\u76D8",
    45e4,
    1e3,
    "\u8FDC\u6D0B\u798F\u8239"
  ],
  [
    "crossroads",
    "\u8DE8\u6D32\u5546\u7F51",
    "1300 \u2014 1450",
    "\u5A01\u5C3C\u65AF\u3001\u6CC9\u5DDE\u4E0E\u970D\u5C14\u6728\u5179",
    "\u5546\u6E2F\u7F51\u7EDC \xB7 \u6D77\u4E0A\u4FDD\u9669",
    12e5,
    1300,
    "\u8DE8\u6D32\u5546\u8239"
  ],
  [
    "oceanic",
    "\u5927\u6D0B\u822A\u8DEF",
    "1450 \u2014 1600",
    "\u5927\u897F\u6D0B\u4E0E\u8DE8\u6D0B\u8D38\u6613\u7F51\u7EDC",
    "\u5361\u62C9\u7EF4\u5C14 \xB7 \u514B\u62C9\u514B",
    3e6,
    1450,
    "\u514B\u62C9\u514B\u8FDC\u6D0B\u8239"
  ],
  [
    "global",
    "\u5168\u7403\u5546\u7F51",
    "1600 \u2014 1700",
    "\u9A6C\u5C3C\u62C9\u3001\u6708\u6E2F\u4E0E\u8FDC\u6D0B\u5546\u4F1A",
    "\u76D6\u4F26\u8239 \xB7 \u8FDC\u6D0B\u4FDD\u9669",
    9e6,
    1600,
    "\u76D6\u4F26\u5546\u8239"
  ],
  [
    "early-modern",
    "\u8FD1\u4EE3\u65E9\u671F",
    "1700 \u2014 1750",
    "\u5168\u7403\u5E02\u573A\u8054\u52A8\u4E0E\u5546\u8D38\u91D1\u878D",
    "\u5927\u578B\u5546\u8239 \xB7 \u5546\u4E1A\u8D26\u7C3F",
    25e6,
    1700,
    "\u5927\u578B\u8FDC\u6D0B\u5546\u8239"
  ]
].map(
  ([id, title, years, subtitle, tech, threshold, startYear, shipName], i) => ({
    id: String(id),
    title: String(title),
    years: String(years),
    subtitle: String(subtitle),
    tech: String(tech),
    threshold: Number(threshold),
    startYear: Number(startYear),
    shipName: String(shipName),
    color: ["#c5ab74", "#b48b62", "#a39b7b", "#87a190"][i % 4]
  })
);
var good = (id, name, base, era, color, unit = "\u7BB1") => ({ id, name, icon: name[0], base, era, color, unit });
var goods = [
  good("grain", "\u8C37\u7269", 18, 0, "#d9c286", "\u888B"),
  good("salt", "\u76D0", 26, 0, "#e2dfc7", "\u7F50"),
  good("linen", "\u4E9A\u9EBB", 42, 0, "#c8c5a3", "\u6346"),
  good("copper", "\u94DC\u952D", 82, 0, "#b98565", "\u5757"),
  good("cedar", "\u96EA\u677E\u6728", 66, 0, "#8fa783", "\u6BB5"),
  good("pottery", "\u9676\u5668", 58, 0, "#c48b62"),
  good("oil", "\u6A44\u6984\u6CB9", 74, 1, "#c2bc6a", "\u7F50"),
  good("tin", "\u9521\u952D", 105, 1, "#b6c9c0", "\u5757"),
  good("dye", "\u7D2B\u67D3\u6599", 145, 1, "#ae8ba8", "\u5323"),
  good("wine", "\u8461\u8404\u9152", 98, 2, "#b48679", "\u6876"),
  good("iron", "\u94C1\u6750", 84, 2, "#95a49d"),
  good("glass", "\u73BB\u7483\u5668", 130, 2, "#87b5b0"),
  good("silk", "\u4E1D\u7EF8", 195, 3, "#d4a586", "\u5339"),
  good("pepper", "\u80E1\u6912", 145, 3, "#aab47c", "\u888B"),
  good("cinnamon", "\u8089\u6842", 168, 3, "#b89568"),
  good("gems", "\u5B9D\u77F3", 420, 4, "#84b8aa", "\u5323"),
  good("ivory-sub", "\u73CD\u73E0", 340, 4, "#e7d9b9", "\u5323"),
  good("porcelain", "\u74F7\u5668", 245, 5, "#c0d6d0"),
  good("tea", "\u8336\u53F6", 175, 5, "#8cb088"),
  good("cotton", "\u68C9\u5E03", 108, 5, "#d1c5a1", "\u5339"),
  good("cloves", "\u4E01\u9999", 280, 6, "#b9a28c"),
  good("nutmeg", "\u8089\u8C46\u853B", 245, 6, "#ad926c"),
  good("paper", "\u7EB8\u5F20", 90, 7, "#e0d4ad"),
  good("sugar", "\u8517\u7CD6", 130, 8, "#d6cbaa", "\u888B"),
  good("cocoa", "\u53EF\u53EF", 175, 8, "#b1886f", "\u888B"),
  good("tobacco", "\u70DF\u8349", 148, 8, "#aba076"),
  good("silver", "\u767D\u94F6", 520, 8, "#d3d8cd", "\u7BB1"),
  good("coffee", "\u5496\u5561", 192, 9, "#b29574", "\u888B"),
  good("indigo", "\u975B\u84DD", 230, 10, "#8497be", "\u5323")
];
var port = (id, name, polity, region, lon, lat, era, produces, demands, basin, danger = 0.15) => ({
  id,
  name,
  polity,
  region,
  x: lon / 180,
  y: lat / 90,
  era,
  produces,
  demands,
  basin,
  danger
});
var ports = [
  port(
    "memphis",
    "\u5C3C\u7F57\u6CB3\u53E3",
    "\u53E4\u57C3\u53CA",
    "\u5C3C\u7F57\u6CB3\u4E09\u89D2\u6D32",
    31.2,
    31.4,
    0,
    ["grain", "linen", "pottery"],
    ["cedar", "copper", "salt"],
    "med"
  ),
  port(
    "ur",
    "\u4E4C\u5C14",
    "\u4E24\u6CB3\u57CE\u90A6",
    "\u6CE2\u65AF\u6E7E\u5317\u5CB8",
    46.1,
    30.9,
    0,
    ["grain", "pottery"],
    ["copper", "cedar", "linen"],
    "gulf"
  ),
  port(
    "dilmun",
    "\u8FEA\u5C14\u8499",
    "\u8FEA\u5C14\u8499\u5546\u4EBA",
    "\u6CE2\u65AF\u6E7E",
    50.6,
    26,
    0,
    ["salt", "copper"],
    ["grain", "pottery", "linen"],
    "gulf",
    0.17
  ),
  port(
    "lothal",
    "\u6D1B\u5854\u5C14",
    "\u5370\u5EA6\u6CB3\u6D41\u57DF",
    "\u53E4\u5409\u62C9\u7279\u6CBF\u5CB8",
    72.2,
    22.5,
    0,
    ["linen", "pottery", "salt"],
    ["copper", "cedar", "grain"],
    "indian",
    0.2
  ),
  port(
    "byblos",
    "\u6BD4\u5E03\u9C81\u65AF",
    "\u9ECE\u51E1\u7279\u6E2F\u90A6",
    "\u4E1C\u5730\u4E2D\u6D77",
    35.6,
    34.1,
    0,
    ["cedar", "pottery"],
    ["grain", "copper", "linen"],
    "med"
  ),
  port(
    "magAN",
    "\u9A6C\u5E72",
    "\u963F\u66FC\u6CBF\u5CB8\u805A\u843D",
    "\u963F\u66FC\u6D77\u6E7E",
    58.4,
    23.6,
    0,
    ["copper", "salt"],
    ["grain", "linen", "pottery"],
    "gulf",
    0.19
  ),
  port(
    "crete",
    "\u514B\u91CC\u7279",
    "\u7231\u7434\u6D77\u6E2F\u90A6",
    "\u7231\u7434\u6D77",
    25.1,
    35.3,
    1,
    ["oil", "pottery", "wine"],
    ["copper", "tin", "cedar"],
    "med"
  ),
  port(
    "ugarit",
    "\u4E4C\u52A0\u91CC\u7279",
    "\u9ECE\u51E1\u7279\u6E2F\u90A6",
    "\u4E1C\u5730\u4E2D\u6D77\u5317\u5CB8",
    35.8,
    35.6,
    1,
    ["dye", "cedar", "oil"],
    ["grain", "tin", "copper"],
    "med"
  ),
  port(
    "tyre",
    "\u63A8\u7F57",
    "\u8153\u5C3C\u57FA\u6E2F\u90A6",
    "\u9ECE\u51E1\u7279\u6D77\u5CB8",
    35.2,
    33.3,
    2,
    ["dye", "glass", "cedar"],
    ["grain", "iron", "wine"],
    "med"
  ),
  port(
    "carthage",
    "\u8FE6\u592A\u57FA",
    "\u5317\u975E\u6E2F\u90A6",
    "\u7A81\u5C3C\u65AF\u6E7E",
    10.3,
    36.9,
    2,
    ["oil", "grain", "salt"],
    ["dye", "iron", "glass"],
    "med",
    0.18
  ),
  port(
    "gadir",
    "\u52A0\u8FEA\u5C14",
    "\u4F0A\u6BD4\u5229\u4E9A\u6E2F\u90A6",
    "\u76F4\u5E03\u7F57\u9640\u5916\u6D77",
    -6.3,
    36.5,
    2,
    ["tin", "silver", "salt"],
    ["wine", "oil", "glass"],
    "atlantic",
    0.23
  ),
  port(
    "alexandria",
    "\u4E9A\u5386\u5C71\u5927\u91CC\u4E9A",
    "\u57C3\u53CA\u6D77\u8D38\u57CE\u5E02",
    "\u5730\u4E2D\u6D77\u5357\u5CB8",
    29.9,
    31.2,
    3,
    ["grain", "glass", "linen"],
    ["silk", "pepper", "cinnamon"],
    "med"
  ),
  port(
    "ostia",
    "\u5965\u65AF\u63D0\u4E9A",
    "\u610F\u5927\u5229\u6E2F\u57CE",
    "\u7B2C\u52D2\u5C3C\u5B89\u6D77",
    12.3,
    41.8,
    3,
    ["wine", "glass", "iron"],
    ["grain", "silk", "pepper"],
    "med"
  ),
  port(
    "berenike",
    "\u8D1D\u52D2\u5C3C\u57FA",
    "\u7EA2\u6D77\u6E2F\u57CE",
    "\u7EA2\u6D77\u897F\u5CB8",
    35.5,
    23.9,
    3,
    ["glass", "linen"],
    ["pepper", "silk", "cinnamon"],
    "redsea",
    0.22
  ),
  port(
    "muziris",
    "\u7A46\u9F50\u91CC\u65AF",
    "\u9A6C\u62C9\u5DF4\u5C14\u6E2F\u90A6",
    "\u5370\u5EA6\u897F\u5CB8",
    76.2,
    10.2,
    3,
    ["pepper", "cinnamon"],
    ["glass", "copper", "wine"],
    "indian",
    0.21
  ),
  port(
    "constantinople",
    "\u541B\u58EB\u5766\u4E01\u5821",
    "\u4E1C\u7F57\u9A6C\u5546\u6E2F",
    "\u535A\u65AF\u666E\u9C81\u65AF\u6D77\u5CE1",
    29,
    41,
    4,
    ["silk", "glass", "wine"],
    ["grain", "gems", "pepper"],
    "med",
    0.2
  ),
  port(
    "siraf",
    "\u897F\u62C9\u592B",
    "\u6CE2\u65AF\u6D77\u8D38\u57CE\u5E02",
    "\u6CE2\u65AF\u6E7E\u4E1C\u5CB8",
    52.3,
    27.7,
    4,
    ["ivory-sub", "pottery"],
    ["silk", "cinnamon", "grain"],
    "gulf",
    0.2
  ),
  port(
    "adulis",
    "\u963F\u675C\u5229\u65AF",
    "\u963F\u514B\u82CF\u59C6\u6D77\u6E2F",
    "\u7EA2\u6D77\u5357\u90E8",
    39.7,
    15.3,
    4,
    ["salt", "gems"],
    ["linen", "copper", "glass"],
    "redsea",
    0.24
  ),
  port(
    "guangzhou",
    "\u5E7F\u5DDE",
    "\u5CAD\u5357\u5546\u6E2F",
    "\u4E2D\u56FD\u5357\u6D77",
    113.3,
    23.1,
    5,
    ["silk", "tea", "porcelain"],
    ["pepper", "ivory-sub", "gems"],
    "china",
    0.22
  ),
  port(
    "basra",
    "\u5DF4\u58EB\u62C9",
    "\u4E24\u6CB3\u6D77\u8D38\u57CE\u5E02",
    "\u6CE2\u65AF\u6E7E\u5317\u5CB8",
    47.8,
    30.5,
    5,
    ["cotton", "pottery"],
    ["porcelain", "tea", "pepper"],
    "gulf"
  ),
  port(
    "aden",
    "\u4E9A\u4E01",
    "\u963F\u62C9\u4F2F\u5546\u6E2F",
    "\u4E9A\u4E01\u6E7E",
    45,
    12.8,
    5,
    ["salt", "cotton"],
    ["grain", "silk", "porcelain"],
    "indian",
    0.25
  ),
  port(
    "palembang",
    "\u5DE8\u6E2F",
    "\u82CF\u95E8\u7B54\u814A\u5546\u6E2F",
    "\u9A6C\u516D\u7532\u6D77\u5CE1\u5357\u7AEF",
    104.8,
    -3,
    5,
    ["pepper", "gems"],
    ["silk", "porcelain", "cotton"],
    "southeast",
    0.28
  ),
  port(
    "quanzhou",
    "\u6CC9\u5DDE",
    "\u798F\u5EFA\u5546\u6E2F",
    "\u4E2D\u56FD\u4E1C\u5357\u6CBF\u6D77",
    118.6,
    24.9,
    6,
    ["porcelain", "silk", "tea"],
    ["cloves", "pepper", "gems"],
    "china"
  ),
  port(
    "calicut",
    "\u5361\u5229\u5361\u7279",
    "\u9A6C\u62C9\u5DF4\u5C14\u5546\u6E2F",
    "\u5370\u5EA6\u897F\u5CB8",
    75.8,
    11.3,
    6,
    ["pepper", "cotton", "cinnamon"],
    ["porcelain", "silk", "cloves"],
    "indian",
    0.23
  ),
  port(
    "kilwa",
    "\u57FA\u5C14\u74E6",
    "\u4E1C\u975E\u6D77\u5CB8\u5546\u6E2F",
    "\u65AF\u74E6\u5E0C\u91CC\u6D77\u5CB8",
    39.5,
    -9,
    6,
    ["gems", "ivory-sub"],
    ["cotton", "porcelain", "iron"],
    "indian",
    0.24
  ),
  port(
    "venice",
    "\u5A01\u5C3C\u65AF",
    "\u5A01\u5C3C\u65AF\u5546\u4EBA",
    "\u4E9A\u5F97\u91CC\u4E9A\u6D77",
    12.3,
    45.4,
    6,
    ["glass", "wine"],
    ["silk", "pepper", "cotton"],
    "med"
  ),
  port(
    "hormuz",
    "\u970D\u5C14\u6728\u5179",
    "\u6D77\u5CE1\u5546\u6E2F",
    "\u970D\u5C14\u6728\u5179\u6D77\u5CE1",
    56.5,
    27.1,
    7,
    ["ivory-sub", "salt"],
    ["silk", "paper", "cloves"],
    "gulf",
    0.3
  ),
  port(
    "malacca",
    "\u9A6C\u516D\u7532",
    "\u6D77\u5CE1\u5546\u6E2F",
    "\u9A6C\u516D\u7532\u6D77\u5CE1",
    102.3,
    2.2,
    7,
    ["cloves", "nutmeg", "pepper"],
    ["porcelain", "cotton", "silver"],
    "southeast",
    0.3
  ),
  port(
    "lisbon",
    "\u91CC\u65AF\u672C",
    "\u8461\u8404\u7259\u5546\u6E2F",
    "\u4F0A\u6BD4\u5229\u4E9A\u5927\u897F\u6D0B\u5CB8",
    -9.1,
    38.7,
    8,
    ["wine", "oil", "iron"],
    ["sugar", "cocoa", "pepper"],
    "atlantic",
    0.24
  ),
  port(
    "goa",
    "\u679C\u963F",
    "\u5370\u5EA6\u897F\u5CB8\u5546\u6E2F",
    "\u5EB7\u574E\u6D77\u5CB8",
    73.8,
    15.5,
    8,
    ["cotton", "pepper", "gems"],
    ["silver", "porcelain", "wine"],
    "indian",
    0.3
  ),
  port(
    "santo-domingo",
    "\u5723\u591A\u660E\u5404",
    "\u52A0\u52D2\u6BD4\u6D77\u6E2F",
    "\u4F0A\u65AF\u5E15\u5C3C\u5965\u62C9\u5C9B",
    -69.9,
    18.5,
    8,
    ["sugar", "cocoa", "tobacco"],
    ["iron", "linen", "wine"],
    "caribbean",
    0.34
  ),
  port(
    "havana",
    "\u54C8\u74E6\u90A3",
    "\u52A0\u52D2\u6BD4\u6D77\u6E2F",
    "\u53E4\u5DF4\u5C9B\u5317\u5CB8",
    -82.4,
    23.1,
    8,
    ["sugar", "tobacco"],
    ["iron", "pottery", "wine"],
    "caribbean",
    0.35
  ),
  port(
    "veracruz",
    "\u97E6\u62C9\u514B\u9C81\u65AF",
    "\u7F8E\u6D32\u5546\u6E2F",
    "\u58A8\u897F\u54E5\u6E7E",
    -96.1,
    19.2,
    8,
    ["silver", "cocoa"],
    ["silk", "iron", "porcelain"],
    "caribbean",
    0.33
  ),
  port(
    "manila",
    "\u9A6C\u5C3C\u62C9",
    "\u5415\u5B8B\u5546\u6E2F",
    "\u83F2\u5F8B\u5BBE\u7FA4\u5C9B",
    121,
    14.6,
    9,
    ["silver", "sugar"],
    ["silk", "porcelain", "tea"],
    "southeast",
    0.29
  ),
  port(
    "yuegang",
    "\u6708\u6E2F",
    "\u798F\u5EFA\u6D77\u8D38\u6E2F",
    "\u4E2D\u56FD\u4E1C\u5357\u6CBF\u6D77",
    117.8,
    24.4,
    9,
    ["porcelain", "tea", "silk"],
    ["silver", "cloves", "nutmeg"],
    "china",
    0.22
  ),
  port(
    "amsterdam",
    "\u963F\u59C6\u65AF\u7279\u4E39",
    "\u5C3C\u5FB7\u5170\u5546\u6E2F",
    "\u5317\u6D77\u6CBF\u5CB8",
    4.9,
    52.4,
    9,
    ["iron", "linen", "glass"],
    ["coffee", "tea", "sugar"],
    "atlantic",
    0.23
  ),
  port(
    "batavia",
    "\u5DF4\u8FBE\u7EF4\u4E9A",
    "\u722A\u54C7\u5546\u6E2F",
    "\u722A\u54C7\u5C9B\u5317\u5CB8",
    106.8,
    -6.1,
    9,
    ["cloves", "nutmeg", "coffee"],
    ["silver", "cotton", "porcelain"],
    "southeast",
    0.31
  ),
  port(
    "london",
    "\u4F26\u6566",
    "\u4E0D\u5217\u98A0\u5546\u6E2F",
    "\u6CF0\u6664\u58EB\u6CB3\u53E3",
    -0.1,
    51.5,
    10,
    ["iron", "linen", "glass"],
    ["tea", "coffee", "indigo"],
    "atlantic",
    0.22
  ),
  port(
    "surat",
    "\u82CF\u62C9\u7279",
    "\u53E4\u5409\u62C9\u7279\u5546\u6E2F",
    "\u5370\u5EA6\u897F\u5CB8",
    72.8,
    21.2,
    10,
    ["indigo", "cotton", "gems"],
    ["silver", "coffee", "porcelain"],
    "indian",
    0.25
  )
];
ports.push(...extendedPorts, ...majorPorts);
goods.push(...extendedGoods);
var goodById = new Map(goods.map((item) => [item.id, item]));
var portById = new Map(ports.map((item) => [item.id, item]));
var localMarkets = createMarketCatalog(ports, goods);

// src/port-life.ts
var MAX_DAY = 1e7;
var MAX_PORTS = ports.length;
var roles = [
  {
    id: "steward",
    role: "\u5546\u6808\u7BA1\u4E8B",
    portrait: "\u5546",
    names: ["\u963F\u5F25", "\u5854\u62C9", "\u7C73\u62C9", "\u82CF\u5B89", "\u963F\u4E39", "\u4F0A\u5A1C"]
  },
  {
    id: "shipwright",
    role: "\u8239\u575E\u5320\u4EBA",
    portrait: "\u5320",
    names: ["\u7EB3\u6728", "\u4F0A\u8428", "\u8BFA\u5170", "\u6D1B\u514B", "\u963F\u6587", "\u8428\u7C73"]
  },
  {
    id: "gardener",
    role: "\u6E2F\u56ED\u56ED\u4E01",
    portrait: "\u56ED",
    names: ["\u83B1\u96C5", "\u963F\u79BE", "\u5A1C\u4F9D", "\u82CF\u91CC", "\u53F6\u5A1C", "\u6885\u62C9"]
  }
];
var facilityRows = [
  {
    id: "warehouse",
    name: "\u5BB6\u65CF\u8D27\u6808",
    description: "\u6539\u8FDB\u88C5\u5378\u4E0E\u6536\u7EB3\u3002\u6BCF\u7EA7\u4E3A\u6574\u4E2A\u8239\u961F\u589E\u52A0 4 \u683C\u6709\u6548\u8D27\u8231\uFF0C\u4E0A\u9650 32 \u683C\u3002",
    base: 280,
    era: 0
  },
  {
    id: "workshop",
    name: "\u7801\u5934\u5DE5\u574A",
    description: "\u6276\u6301\u672C\u5730\u52A0\u5DE5\u3002\u6BCF\u7EA7\u4F7F\u6B64\u6E2F\u672C\u5730\u7269\u4EA7\u91C7\u8D2D\u4EF7\u964D\u4F4E 3%\uFF0C\u6700\u591A 3 \u7EA7\u3002",
    base: 450,
    era: 0
  },
  {
    id: "garden",
    name: "\u8865\u7ED9\u83DC\u56ED",
    description: "\u5EFA\u7ACB\u8865\u7ED9\u534F\u4F5C\u3002\u6BCF\u7EA7\u8BA9\u5168\u8239\u961F\u8865\u7ED9\u6D88\u8017\u51CF\u5C11 1.5%\uFF0C\u8BBE\u65BD\u90E8\u5206\u4E0A\u9650 12%\u3002",
    base: 240,
    era: 0
  }
];
var techRows = [
  {
    id: "ledger",
    name: "\u5546\u53F7\u8D26\u518C",
    description: "\u7EDF\u4E00\u5EA6\u91CF\u548C\u8D26\u76EE\uFF0C\u5404\u6E2F\u4EA4\u6613\u7A0E\u964D\u4F4E 0.3 \u4E2A\u767E\u5206\u70B9\u3002",
    cost: 180,
    era: 0,
    requires: []
  },
  {
    id: "stowage",
    name: "\u5206\u8231\u5806\u88C5",
    description: "\u8239\u961F\u6709\u6548\u8D27\u8231\u589E\u52A0 6 \u683C\u3002",
    cost: 300,
    era: 0,
    requires: ["ledger"]
  },
  {
    id: "stars",
    name: "\u661F\u8C61\u822A\u8BB0",
    description: "\u8BB0\u5F55\u6052\u661F\u4E0E\u5CB8\u6807\uFF0C\u822A\u884C\u4E8B\u4EF6\u98CE\u9669\u964D\u4F4E 1.5 \u4E2A\u767E\u5206\u70B9\u3002",
    cost: 480,
    era: 1,
    requires: ["ledger"]
  },
  {
    id: "sailcloth",
    name: "\u7EC7\u5E06\u5DE5\u827A",
    description: "\u6539\u826F\u5E06\u5E03\u4E0E\u7D22\u5177\uFF0C\u822A\u884C\u901F\u5EA6\u63D0\u9AD8 6%\u3002",
    cost: 580,
    era: 1,
    requires: ["stowage"]
  },
  {
    id: "preservation",
    name: "\u5E72\u7CAE\u5C01\u50A8",
    description: "\u6539\u5584\u98DF\u7269\u5C01\u50A8\uFF0C\u822A\u7A0B\u8865\u7ED9\u6D88\u8017\u51CF\u5C11 8%\u3002",
    cost: 850,
    era: 2,
    requires: ["stowage"]
  },
  {
    id: "survey",
    name: "\u6CBF\u5CB8\u6D4B\u7ED8",
    description: "\u822A\u884C\u901F\u5EA6\u63D0\u9AD8 6%\uFF0C\u4E8B\u4EF6\u98CE\u9669\u964D\u4F4E 1.5 \u4E2A\u767E\u5206\u70B9\u3002",
    cost: 1400,
    era: 3,
    requires: ["stars"]
  },
  {
    id: "craft-guilds",
    name: "\u5DE5\u5320\u534F\u4F5C",
    description: "\u5404\u6E2F\u672C\u5730\u7269\u4EA7\u91C7\u8D2D\u4EF7\u964D\u4F4E 3%\u3002",
    cost: 2200,
    era: 4,
    requires: ["ledger"]
  },
  {
    id: "compass",
    name: "\u7F57\u76D8\u822A\u8DEF",
    description: "\u822A\u884C\u901F\u5EA6\u63D0\u9AD8 8%\u3002",
    cost: 3800,
    era: 6,
    requires: ["survey", "sailcloth"]
  },
  {
    id: "marine-insurance",
    name: "\u5546\u4F1A\u4E92\u4FDD",
    description: "\u7531\u719F\u6089\u822A\u8DEF\u7684\u5546\u4F1A\u534F\u4F5C\u62A4\u822A\uFF0C\u4E8B\u4EF6\u98CE\u9669\u964D\u4F4E 3 \u4E2A\u767E\u5206\u70B9\u3002",
    cost: 6800,
    era: 8,
    requires: ["craft-guilds", "survey"]
  }
];
var bundleRows = [
  {
    id: "harbor-pantry",
    name: "\u6E2F\u53E3\u5F00\u5F20\u793C",
    description: "\u4E3A\u5546\u6808\u6536\u96C6\u7CAE\u98DF\u3001\u7EC7\u7269\u4E0E\u5BB9\u5668\u3002\u4EA4\u9F50\u540E\u5956\u52B1 220 \u91D1\u5E01\u3001\u58F0\u671B 3\uFF0C\u5E76\u6C38\u4E45\u589E\u52A0 2 \u683C\u8D27\u8231\u3002",
    requirements: [
      { goodId: "grain", quantity: 6 },
      { goodId: "linen", quantity: 3 },
      { goodId: "pottery", quantity: 2 }
    ],
    reward: 220
  },
  {
    id: "shipwright-kit",
    name: "\u8239\u5320\u7684\u5DE5\u5177\u67B6",
    description: "\u6728\u6750\u3001\u91D1\u5C5E\u548C\u76D0\uFF0C\u652F\u6301\u7801\u5934\u4FEE\u9020\u3002\u4EA4\u9F50\u540E\u5956\u52B1 360 \u91D1\u5E01\u3001\u58F0\u671B 3\uFF0C\u5E76\u6C38\u4E45\u964D\u4F4E 0.5 \u4E2A\u767E\u5206\u70B9\u822A\u884C\u98CE\u9669\u3002",
    requirements: [
      { goodId: "cedar", quantity: 4 },
      { goodId: "copper", quantity: 2 },
      { goodId: "salt", quantity: 4 }
    ],
    reward: 360
  },
  {
    id: "world-teatable",
    name: "\u8FDC\u6D0B\u4F1A\u5BA2\u5385",
    description: "\u628A\u8336\u53F6\u3001\u80E1\u6912\u4E0E\u74F7\u5668\u5E26\u56DE\u5546\u6808\u3002\u4EA4\u9F50\u540E\u5956\u52B1 1200 \u91D1\u5E01\u3001\u58F0\u671B 5\uFF0C\u5E76\u6C38\u4E45\u964D\u4F4E 0.3 \u4E2A\u767E\u5206\u70B9\u4EA4\u6613\u7A0E\u3002",
    requirements: [
      { goodId: "tea", quantity: 3 },
      { goodId: "pepper", quantity: 3 },
      { goodId: "porcelain", quantity: 2 }
    ],
    reward: 1200
  }
];
var hash2 = (text) => {
  let n = 2166136261;
  for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
};
var cycleAt = (day) => Math.floor((day - 1) / 7);
var commissionId = (portId, cycle, slot) => `${portId}~${cycle}~${slot}`;
var isFestival = (day) => (day - 1) % 28 + 1 === 14;
var integer = (value, min, max) => typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= max;
var object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var exactKeys = (value, keys) => Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
var knownResident = (id) => {
  const [portId, role, ...rest] = id.split("~");
  return !rest.length && portById.has(portId) && roles.some((r) => r.id === role);
};
var parseCommissionId = (id) => {
  const parts = id.split("~");
  if (parts.length !== 3 || !portById.has(parts[0]) || !/^\d+$/.test(parts[1]) || !/^[0-2]$/.test(parts[2]))
    return null;
  const cycle = Number(parts[1]), slot = Number(parts[2]);
  if (!integer(cycle, 0, MAX_DAY) || commissionId(parts[0], cycle, slot) !== id)
    return null;
  return { portId: parts[0], cycle, slot };
};
var requestQuantity = (era, slot) => 2 + slot + Math.min(3, Math.floor(era / 3));
var requestReward = (good2, quantity, era, festival) => Math.ceil(good2.base * quantity * (1.42 + Math.min(era, 10) * 8e-3)) + 24 + (festival ? 25 : 0);
function createLifeState() {
  return {
    version: 1,
    residents: {},
    accepted: [],
    claimed: {},
    researched: [],
    facilities: {},
    completedBundles: []
  };
}
function readLifeState(raw, day) {
  if (!integer(day, 1, MAX_DAY)) return null;
  if (raw === void 0) return createLifeState();
  if (!object(raw) || !exactKeys(raw, [
    "version",
    "residents",
    "accepted",
    "claimed",
    "researched",
    "facilities",
    "completedBundles"
  ]) || raw.version !== 1)
    return null;
  if (!object(raw.residents) || !object(raw.claimed) || !object(raw.facilities) || !Array.isArray(raw.accepted) || !Array.isArray(raw.researched) || !Array.isArray(raw.completedBundles))
    return null;
  if (Object.keys(raw.residents).length > MAX_PORTS * 3 || Object.keys(raw.facilities).length > MAX_PORTS || Object.keys(raw.claimed).length > MAX_PORTS * 6 || raw.accepted.length > 3 || raw.researched.length > techRows.length || raw.completedBundles.length > bundleRows.length)
    return null;
  const result = createLifeState();
  for (const [id, memory] of Object.entries(raw.residents)) {
    if (!knownResident(id) || !object(memory) || !exactKeys(memory, ["friendship", "lastTalkDay"]) || !integer(memory.friendship, 0, 100) || !integer(memory.lastTalkDay, 0, day))
      return null;
    result.residents[id] = {
      friendship: memory.friendship,
      lastTalkDay: memory.lastTalkDay
    };
  }
  for (const [id, claimedDay] of Object.entries(raw.claimed)) {
    const key = parseCommissionId(id);
    if (!key || !integer(claimedDay, 1, day) || claimedDay < key.cycle * 7 + 1 || claimedDay > key.cycle * 7 + 14)
      return null;
    if (key.cycle >= cycleAt(day) - 1) result.claimed[id] = claimedDay;
  }
  const acceptedIds = /* @__PURE__ */ new Set();
  for (const entry of raw.accepted) {
    if (!object(entry) || !exactKeys(entry, [
      "id",
      "portId",
      "cycle",
      "slot",
      "goodId",
      "quantity",
      "reward",
      "acceptedDay",
      "expiresDay",
      "festival",
      "era"
    ]))
      return null;
    if (typeof entry.id !== "string" || typeof entry.portId !== "string" || typeof entry.goodId !== "string")
      return null;
    const key = parseCommissionId(entry.id), good2 = goodById.get(entry.goodId);
    if (!key || !good2 || acceptedIds.has(entry.id) || Object.hasOwn(raw.claimed, entry.id) || key.portId !== entry.portId || key.cycle !== entry.cycle || key.slot !== entry.slot)
      return null;
    if (!integer(entry.era, 0, 10) || good2.era > entry.era || portById.get(entry.portId).era > entry.era || !integer(entry.acceptedDay, 1, day) || cycleAt(entry.acceptedDay) !== key.cycle || entry.expiresDay !== key.cycle * 7 + 14 || typeof entry.festival !== "boolean" || entry.festival !== isFestival(entry.acceptedDay))
      return null;
    if (entry.quantity !== requestQuantity(entry.era, key.slot) || entry.reward !== requestReward(good2, entry.quantity, entry.era, entry.festival))
      return null;
    acceptedIds.add(entry.id);
    result.accepted.push({
      id: entry.id,
      portId: entry.portId,
      cycle: key.cycle,
      slot: key.slot,
      goodId: entry.goodId,
      quantity: entry.quantity,
      reward: entry.reward,
      acceptedDay: entry.acceptedDay,
      expiresDay: entry.expiresDay,
      festival: entry.festival,
      era: entry.era
    });
  }
  for (const id of raw.researched) {
    if (typeof id !== "string" || !techRows.some((t) => t.id === id) || result.researched.includes(id))
      return null;
    result.researched.push(id);
  }
  if (techRows.some(
    (t) => result.researched.includes(t.id) && t.requires.some((id) => !result.researched.includes(id))
  ))
    return null;
  for (const [portId, levels] of Object.entries(raw.facilities)) {
    if (!portById.has(portId) || !object(levels) || !exactKeys(levels, ["warehouse", "workshop", "garden"]) || !facilityRows.every((f) => integer(levels[f.id], 0, 3)))
      return null;
    result.facilities[portId] = {
      warehouse: levels.warehouse,
      workshop: levels.workshop,
      garden: levels.garden
    };
  }
  for (const id of raw.completedBundles) {
    if (typeof id !== "string" || !bundleRows.some((b) => b.id === id) || result.completedBundles.includes(id))
      return null;
    result.completedBundles.push(id);
  }
  return result;
}
var PortLife = class {
  constructor(state, host) {
    this.state = state;
    this.host = host;
  }
  state;
  host;
  action(ok, message) {
    return { ok, message };
  }
  portReady() {
    return !this.host.atSea && portById.has(this.host.currentPortId) && portById.get(this.host.currentPortId).era <= this.host.eraIndex;
  }
  relation(id) {
    return this.state.residents[id] ?? { friendship: 0, lastTalkDay: 0 };
  }
  gainFriendship(id, amount) {
    const memory = this.relation(id);
    this.state.residents[id] = {
      ...memory,
      friendship: Math.min(100, memory.friendship + amount)
    };
  }
  prune() {
    const minCycle = cycleAt(this.host.day) - 1;
    for (const id of Object.keys(this.state.claimed))
      if ((parseCommissionId(id)?.cycle ?? -1) < minCycle)
        delete this.state.claimed[id];
  }
  season() {
    const seasonIndex = Math.floor((this.host.day - 1) / 28) % 4;
    const day = (this.host.day - 1) % 28 + 1;
    return {
      name: ["\u6625", "\u590F", "\u79CB", "\u51AC"][seasonIndex],
      day,
      festival: day === 14 ? ["\u5F00\u5E06\u96C6\u4F1A", "\u6D77\u98CE\u591C\u5E02", "\u6536\u83B7\u96C6\u4F1A", "\u5F52\u6E2F\u706F\u4F1A"][seasonIndex] : ""
    };
  }
  residents() {
    const port2 = portById.get(this.host.currentPortId);
    if (!port2) return [];
    return roles.map((role, i) => {
      const id = `${port2.id}~${role.id}`, memory = this.relation(id);
      const name = role.names[hash2(`${port2.id}:${i}`) % role.names.length];
      const festival = this.season().festival;
      let dialogue = [
        `\u6211\u662F${port2.name}\u7684\u5546\u6808\u7BA1\u4E8B\u3002\u5E26\u6765\u516C\u544A\u4E0A\u7684\u8D27\u7269\uFF0C\u6211\u4F1A\u6309\u7EA6\u652F\u4ED8\u62A5\u916C\u3002`,
        `\u5728${port2.name}\u5EFA\u8D77\u8D27\u6808\uFF0C\u8239\u5458\u88C5\u8239\u65F6\u5C31\u4E0D\u5FC5\u56DB\u5904\u627E\u6750\u6599\u4E86\u3002`,
        `${this.season().name}\u5B63\u5230\u4E86\u3002\u6BCF\u9022\u7B2C\u5341\u56DB\u5929\uFF0C\u7801\u5934\u90FD\u4F1A\u4E3E\u884C\u96C6\u4F1A\u3002`
      ][i];
      if (festival)
        dialogue = `\u4ECA\u5929\u662F${festival}\u3002\u804A\u804A\u8FD1\u51B5\u5427\uFF0C\u4ECA\u5929\u65B0\u63A5\u59D4\u6258\u8FD8\u4F1A\u591A\u7ED9 25 \u91D1\u5E01\u3002`;
      else if (memory.friendship >= 50)
        dialogue = `${name}\u8BA4\u51FA\u4E86\u4F60\u7684\u8239\u65D7\uFF1A\u8001\u670B\u53CB\uFF0C\u6B22\u8FCE\u56DE\u5230${port2.name}\u3002\u719F\u6089\u7684\u5546\u4EBA\u4F1A\u7ED9\u4F60\u66F4\u597D\u7684\u7A0E\u8D39\u6761\u4EF6\u3002`;
      else if (memory.lastTalkDay === this.host.day)
        dialogue = "\u4ECA\u5929\u5DF2\u7ECF\u804A\u8FC7\u5566\u3002\u660E\u5929\u518D\u6765\uFF0C\u6211\u4F1A\u7EE7\u7EED\u7559\u610F\u6E2F\u53E3\u7684\u6D88\u606F\u3002";
      return {
        id,
        name,
        role: role.role,
        portrait: role.portrait,
        friendship: memory.friendship,
        dialogue
      };
    });
  }
  talk(id) {
    if (!this.portReady()) return this.action(false, "\u9760\u6E2F\u540E\u624D\u80FD\u62DC\u8BBF\u5C45\u6C11\u3002");
    const resident = this.residents().find((r) => r.id === id);
    if (!resident) return this.action(false, "\u8FD9\u4F4D\u5C45\u6C11\u4E0D\u5728\u5F53\u524D\u6E2F\u53E3\u3002");
    const memory = this.relation(id);
    if (memory.lastTalkDay === this.host.day)
      return this.action(false, "\u4ECA\u5929\u5DF2\u7ECF\u804A\u8FC7\u4E86\uFF0C\u660E\u5929\u518D\u6765\u770B\u770B\u3002");
    const gain = this.season().festival ? 4 : 2;
    this.gainFriendship(id, gain);
    this.state.residents[id].lastTalkDay = this.host.day;
    return this.action(
      true,
      `${resident.name}\u4E0E\u4F60\u804A\u8D77\u7801\u5934\u8FD1\u51B5\uFF0C\u597D\u611F +${gain}\u3002`
    );
  }
  board() {
    const portId = this.host.currentPortId, cycle = cycleAt(this.host.day);
    const port2 = portById.get(portId);
    if (!port2 || port2.era > this.host.eraIndex) return [];
    const choices = this.host.marketGoods(portId).filter((g) => g.era <= this.host.eraIndex).slice().sort((a, b) => a.base - b.base || a.id.localeCompare(b.id)).slice(0, 15);
    if (!choices.length) return [];
    return [0, 1, 2].map((slot) => {
      const id = commissionId(portId, cycle, slot);
      const existing = this.state.accepted.find((c) => c.id === id);
      if (existing) return { ...existing };
      const good2 = choices[(hash2(`${portId}:${cycle}`) + slot * 5) % choices.length];
      const quantity = requestQuantity(this.host.eraIndex, slot), festival = isFestival(this.host.day);
      return {
        id,
        portId,
        cycle,
        slot,
        goodId: good2.id,
        quantity,
        reward: requestReward(good2, quantity, this.host.eraIndex, festival),
        acceptedDay: this.host.day,
        expiresDay: cycle * 7 + 14,
        festival,
        era: this.host.eraIndex
      };
    });
  }
  commissions() {
    this.prune();
    const board = this.board();
    for (const entry of this.state.accepted)
      if (entry.portId === this.host.currentPortId && !board.some((c) => c.id === entry.id))
        board.push({ ...entry });
    return board.map((entry) => {
      const good2 = goodById.get(entry.goodId);
      const accepted = this.state.accepted.some((c) => c.id === entry.id);
      const status = Object.hasOwn(
        this.state.claimed,
        entry.id
      ) ? "completed" : this.host.day > entry.expiresDay ? "expired" : accepted ? "accepted" : "available";
      return {
        id: entry.id,
        title: ["\u5546\u6808\u8865\u8D27", "\u5320\u4EBA\u7684\u65E5\u7528\u91C7\u8D2D", "\u7801\u5934\u805A\u9910\u7B79\u5907"][entry.slot],
        description: `${portById.get(entry.portId).name}\u7684${roles[entry.slot].role}\u9700\u8981 ${entry.quantity} ${good2.unit}${good2.name}\u3002${entry.festival ? "\u96C6\u4F1A\u5956\u52B1\u5DF2\u5305\u542B\u5728\u62A5\u916C\u4E2D\u3002" : ""}\u7B2C ${entry.expiresDay} \u65E5\u7ED3\u675F\u524D\u9001\u8FBE\u3002`,
        goodId: entry.goodId,
        quantity: entry.quantity,
        reward: entry.reward,
        expiresDay: entry.expiresDay,
        status
      };
    });
  }
  acceptCommission(id) {
    if (!this.portReady()) return this.action(false, "\u9760\u6E2F\u540E\u624D\u80FD\u63A5\u53D6\u59D4\u6258\u3002");
    this.prune();
    if (Object.hasOwn(this.state.claimed, id) || this.state.accepted.some((c) => c.id === id))
      return this.action(false, "\u8FD9\u4EFD\u59D4\u6258\u5DF2\u7ECF\u63A5\u53D6\u6216\u5B8C\u6210\u3002");
    const active = this.state.accepted.filter(
      (c) => this.host.day <= c.expiresDay
    );
    if (active.length >= 3)
      return this.action(false, "\u6700\u591A\u540C\u65F6\u63A5\u53D6 3 \u4EFD\u59D4\u6258\uFF0C\u8BF7\u5148\u5B8C\u6210\u5DF2\u6709\u59D4\u6258\u3002");
    const entry = this.board().find((c) => c.id === id);
    if (!entry) return this.action(false, "\u8FD9\u4EFD\u59D4\u6258\u5DF2\u79BB\u5F00\u5F53\u524D\u516C\u544A\u677F\u3002");
    this.state.accepted = active;
    this.state.accepted.push(entry);
    return this.action(
      true,
      `\u5DF2\u63A5\u4E0B\u59D4\u6258\uFF0C\u5728\u7B2C ${entry.expiresDay} \u65E5\u7ED3\u675F\u524D\u5C06\u8D27\u7269\u4EA4\u7ED9\u672C\u6E2F\u5C45\u6C11\u3002`
    );
  }
  deliverCommission(id) {
    if (!this.portReady()) return this.action(false, "\u9760\u6E2F\u540E\u624D\u80FD\u4EA4\u4ED8\u59D4\u6258\u3002");
    const entry = this.state.accepted.find((c) => c.id === id);
    if (!entry || Object.hasOwn(this.state.claimed, id))
      return this.action(false, "\u8BF7\u5148\u63A5\u53D6\u8FD9\u4EFD\u59D4\u6258\uFF0C\u5DF2\u9886\u53D6\u7684\u5956\u52B1\u4E0D\u80FD\u91CD\u590D\u9886\u53D6\u3002");
    if (entry.portId !== this.host.currentPortId)
      return this.action(
        false,
        `\u8BF7\u56DE\u5230${portById.get(entry.portId).name}\u4EA4\u4ED8\u59D4\u6258\u3002`
      );
    if (this.host.day > entry.expiresDay)
      return this.action(false, "\u59D4\u6258\u5DF2\u7ECF\u8FC7\u671F\uFF0C\u8D27\u7269\u4ECD\u4FDD\u7559\u5728\u4F60\u7684\u8239\u4E0A\u3002");
    if (this.host.cargo(entry.goodId) < entry.quantity)
      return this.action(
        false,
        `\u8FD8\u9700\u8981\u51C6\u5907 ${entry.quantity} ${goodById.get(entry.goodId).unit}${goodById.get(entry.goodId).name}\u3002`
      );
    if (!this.host.consumeCargo(entry.goodId, entry.quantity))
      return this.action(false, "\u8D27\u7269\u6570\u91CF\u53D1\u751F\u53D8\u5316\uFF0C\u672A\u5B8C\u6210\u4EA4\u4ED8\u3002");
    this.state.claimed[id] = this.host.day;
    this.state.accepted = this.state.accepted.filter((c) => c.id !== id);
    this.host.addCash(entry.reward);
    this.host.addReputation(1);
    this.gainFriendship(
      `${entry.portId}~${roles[entry.slot].id}`,
      entry.festival ? 10 : 6
    );
    return this.action(
      true,
      `\u4EA4\u4ED8\u5B8C\u6210\uFF0C\u6536\u5230 ${entry.reward} \u91D1\u5E01\uFF0C\u58F0\u671B +1\uFF0C\u59D4\u6258\u4EBA\u7684\u597D\u611F\u4E0A\u5347\u3002`
    );
  }
  technologies() {
    return techRows.map((t) => ({
      ...t,
      requires: [...t.requires],
      unlocked: this.state.researched.includes(t.id)
    }));
  }
  research(id) {
    if (!this.portReady()) return this.action(false, "\u8BF7\u9760\u6E2F\u540E\u7EC4\u7EC7\u7814\u7A76\u3002");
    const tech = techRows.find((t) => t.id === id);
    if (!tech) return this.action(false, "\u6CA1\u6709\u8FD9\u9879\u7814\u7A76\u3002");
    if (this.state.researched.includes(id))
      return this.action(false, "\u8FD9\u9879\u5DE5\u827A\u5DF2\u7ECF\u638C\u63E1\u3002");
    if (tech.era > this.host.eraIndex)
      return this.action(false, "\u5F53\u524D\u65F6\u4EE3\u5C1A\u4E0D\u652F\u6301\u8FD9\u9879\u7814\u7A76\u3002");
    const missing = tech.requires.filter(
      (required) => !this.state.researched.includes(required)
    );
    if (missing.length)
      return this.action(
        false,
        `\u8BF7\u5148\u7814\u7A76${missing.map((id2) => techRows.find((t) => t.id === id2).name).join("\u3001")}\u3002`
      );
    if (!this.host.spendCash(tech.cost))
      return this.action(false, `\u7814\u7A76\u9700\u8981 ${tech.cost} \u91D1\u5E01\u3002`);
    this.state.researched.push(id);
    return this.action(true, `\u5DF2\u638C\u63E1${tech.name}\uFF0C${tech.description}`);
  }
  facilities() {
    const levels = this.state.facilities[this.host.currentPortId] ?? {
      warehouse: 0,
      workshop: 0,
      garden: 0
    };
    return facilityRows.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      cost: Math.ceil(f.base * 1.9 ** levels[f.id]),
      level: levels[f.id]
    }));
  }
  build(id) {
    if (!this.portReady())
      return this.action(false, "\u9760\u6E2F\u540E\u624D\u80FD\u5EFA\u8BBE\u6E2F\u53E3\u8BBE\u65BD\u3002");
    const row = facilityRows.find((f) => f.id === id);
    if (!row || row.era > this.host.eraIndex)
      return this.action(false, "\u5F53\u524D\u65E0\u6CD5\u5EFA\u8BBE\u8FD9\u9879\u8BBE\u65BD\u3002");
    const info = this.facilities().find((f) => f.id === id);
    if (info.level >= 3) return this.action(false, "\u8BE5\u8BBE\u65BD\u5DF2\u8FBE\u5230 3 \u7EA7\u4E0A\u9650\u3002");
    if (!this.host.spendCash(info.cost))
      return this.action(false, `\u5EFA\u8BBE\u9700\u8981 ${info.cost} \u91D1\u5E01\u3002`);
    const portId = this.host.currentPortId;
    const levels = this.state.facilities[portId] ?? {
      warehouse: 0,
      workshop: 0,
      garden: 0
    };
    this.state.facilities[portId] = { ...levels, [row.id]: info.level + 1 };
    return this.action(
      true,
      `${portById.get(portId).name}\u7684${row.name}\u5EFA\u6210 ${info.level + 1} \u7EA7\u3002`
    );
  }
  bundles() {
    return bundleRows.map((b) => ({
      ...b,
      requirements: b.requirements.map((r) => ({ ...r })),
      completed: this.state.completedBundles.includes(b.id)
    }));
  }
  contributeBundle(id) {
    if (!this.portReady())
      return this.action(false, "\u8BF7\u9760\u6E2F\u540E\u628A\u6536\u96C6\u54C1\u4EA4\u7ED9\u5546\u6808\u3002");
    const bundle = bundleRows.find((b) => b.id === id);
    if (!bundle) return this.action(false, "\u6CA1\u6709\u8FD9\u4E2A\u6536\u96C6\u9879\u76EE\u3002");
    if (this.state.completedBundles.includes(id))
      return this.action(false, "\u8FD9\u4EFD\u6536\u96C6\u5DF2\u7ECF\u5B8C\u6210\uFF0C\u4E0D\u80FD\u91CD\u590D\u9886\u53D6\u5956\u52B1\u3002");
    if (bundle.requirements.some(
      (r) => goodById.get(r.goodId).era > this.host.eraIndex
    ))
      return this.action(
        false,
        "\u540E\u7EED\u65F6\u4EE3\u5F00\u653E\u5168\u90E8\u6240\u9700\u5546\u54C1\u540E\uFF0C\u624D\u80FD\u5B8C\u6210\u8FD9\u4EFD\u6536\u96C6\u3002"
      );
    if (bundle.requirements.some((r) => this.host.cargo(r.goodId) < r.quantity))
      return this.action(false, "\u8BF7\u5148\u628A\u6E05\u5355\u4E2D\u7684\u5168\u90E8\u8D27\u7269\u88C5\u8FDB\u8239\u8231\u3002");
    for (const requirement of bundle.requirements) {
      if (!this.host.consumeCargo(requirement.goodId, requirement.quantity))
        throw new Error("LifeHost violated its synchronous cargo contract");
    }
    this.state.completedBundles.push(id);
    this.host.addCash(bundle.reward);
    this.host.addReputation(id === "world-teatable" ? 5 : 3);
    return this.action(
      true,
      `${bundle.name}\u6536\u96C6\u5B8C\u6210\uFF0C\u6536\u5230 ${bundle.reward} \u91D1\u5E01\uFF0C\u5BB6\u65CF\u6C38\u4E45\u5956\u52B1\u5DF2\u751F\u6548\u3002`
    );
  }
  bonuses() {
    const has = (id) => this.state.researched.includes(id);
    const all = Object.values(this.state.facilities), local = this.state.facilities[this.host.currentPortId];
    const warehouses = all.reduce((n, f) => n + f.warehouse, 0), gardens = all.reduce((n, f) => n + f.garden, 0);
    const relation = roles.reduce(
      (n, r) => n + this.relation(`${this.host.currentPortId}~${r.id}`).friendship,
      0
    );
    return {
      speed: 1 + (has("sailcloth") ? 0.06 : 0) + (has("survey") ? 0.06 : 0) + (has("compass") ? 0.08 : 0),
      riskReduction: (has("stars") ? 0.015 : 0) + (has("survey") ? 0.015 : 0) + (has("marine-insurance") ? 0.03 : 0) + (this.state.completedBundles.includes("shipwright-kit") ? 5e-3 : 0),
      taxReduction: (has("ledger") ? 3e-3 : 0) + Math.min(9e-3, relation * 3e-5) + (this.state.completedBundles.includes("world-teatable") ? 3e-3 : 0),
      supplyReduction: Math.min(0.12, gardens * 0.015) + (has("preservation") ? 0.08 : 0),
      capacity: Math.min(32, warehouses * 4) + (has("stowage") ? 6 : 0) + (this.state.completedBundles.includes("harbor-pantry") ? 2 : 0),
      production: (local?.workshop ?? 0) * 0.03 + (has("craft-guilds") ? 0.03 : 0)
    };
  }
};
export {
  PortLife,
  createLifeState,
  readLifeState
};
