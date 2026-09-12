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
function goodsForPort(portId, eraIndex, sandbox = false) {
  return (localMarkets.get(portId) ?? []).filter((item) => sandbox || item.era <= eraIndex);
}
var origins = [
  {
    id: "egypt",
    title: "\u5C3C\u7F57\u6CB3\u4E09\u89D2\u6D32",
    portId: "memphis",
    region: "\u53E4\u57C3\u53CA \xB7 \u524D 3000 \u5E74",
    note: "\u6CB3\u8C37\u7684\u4E30\u6536\uFF0C\u662F\u5BB6\u65CF\u7684\u7B2C\u4E00\u7B14\u8D44\u672C\u3002",
    perk: "\u8C37\u7269\u4E0E\u4E9A\u9EBB\u91C7\u8D2D\u4F18\u60E0 10%",
    capital: 850,
    goods: { grain: 12, linen: 5 },
    accent: "#c8ac77",
    era: 0
  },
  {
    id: "mesopotamia",
    title: "\u4E24\u6CB3\u4E0B\u6E38",
    portId: "ur",
    region: "\u4E24\u6CB3\u57CE\u90A6 \xB7 \u524D 3000 \u5E74",
    note: "\u8D26\u518C\u3001\u9676\u5668\u4E0E\u6CB3\u6E7E\u5546\u8DEF\u3002",
    perk: "\u9676\u5668\u91C7\u8D2D\u4F18\u60E0 12%",
    capital: 920,
    goods: { grain: 8, pottery: 4 },
    accent: "#b9996d",
    era: 0
  },
  {
    id: "levant",
    title: "\u9ECE\u51E1\u7279\u6D77\u5CB8",
    portId: "byblos",
    region: "\u6BD4\u5E03\u9C81\u65AF \xB7 \u524D 3000 \u5E74",
    note: "\u4EE5\u96EA\u677E\u6728\u6362\u53D6\u6D77\u7684\u53E6\u4E00\u5CB8\u3002",
    perk: "\u96EA\u677E\u6728\u91C7\u8D2D\u4F18\u60E0 12%",
    capital: 780,
    goods: { cedar: 6, pottery: 4 },
    accent: "#859d7d",
    era: 0
  },
  {
    id: "dilmun",
    title: "\u6D77\u6E7E\u4E2D\u8F6C\u5730",
    portId: "dilmun",
    region: "\u8FEA\u5C14\u8499 \xB7 \u524D 3000 \u5E74",
    note: "\u4EE5\u76D0\u4E0E\u94DC\u8FDE\u63A5\u4E24\u5CB8\u7684\u5546\u4EBA\u3002",
    perk: "\u76D0\u4E0E\u94DC\u91C7\u8D2D\u4F18\u60E0 8%",
    capital: 900,
    goods: { salt: 8, copper: 3 },
    accent: "#b3a16f",
    era: 0
  },
  {
    id: "indus",
    title: "\u5370\u5EA6\u6CB3\u6D41\u57DF",
    portId: "lothal",
    region: "\u6D1B\u5854\u5C14\u5730\u533A \xB7 \u524D 3000 \u5E74",
    note: "\u9676\u5668\u4E0E\u5E03\u6599\uFF0C\u901A\u5411\u8FDC\u65B9\u7684\u6E2F\u6E7E\u3002",
    perk: "\u4E9A\u9EBB\u4E0E\u9676\u5668\u91C7\u8D2D\u4F18\u60E0 10%",
    capital: 840,
    goods: { linen: 6, pottery: 4 },
    accent: "#93aa88",
    era: 0
  },
  {
    id: "oman",
    title: "\u963F\u66FC\u6D77\u5CB8",
    portId: "magAN",
    region: "\u9A6C\u5E72 \xB7 \u524D 3000 \u5E74",
    note: "\u94DC\u77FF\u4E0E\u6D77\u98CE\u517B\u80B2\u4E86\u8FD9\u7247\u6D77\u5CB8\u3002",
    perk: "\u94DC\u91C7\u8D2D\u4F18\u60E0 12%\uFF0C\u822A\u884C\u98CE\u9669\u964D\u4F4E",
    capital: 800,
    goods: { copper: 5, salt: 6 },
    accent: "#bcb383",
    era: 0
  }
];

// src/market-events.ts
var templates = [
  {
    kind: "storm",
    headline: "\u5916\u6D77\u8FDF\u6765\u7684\u5E06\u5F71",
    source: "\u7801\u5934\u642C\u8FD0\u5DE5",
    goods: ["pepper", "cinnamon", "cloves", "linen", "copper", "cedar"],
    multiplier: 1.22,
    duration: 7
  },
  {
    kind: "drought",
    headline: "\u96E8\u5B63\u8FDF\u8FDF\u672A\u5230",
    source: "\u4E61\u95F4\u884C\u5546",
    goods: ["grain", "linen", "cotton", "sugar"],
    multiplier: 1.27,
    duration: 9
  },
  {
    kind: "harvest",
    headline: "\u4E61\u95F4\u6EE1\u8F7D\u7684\u8F66\u961F",
    source: "\u6536\u8D27\u8F66\u592B",
    goods: ["grain", "linen", "cotton", "sugar"],
    multiplier: 0.79,
    duration: 8
  },
  {
    kind: "repairs",
    headline: "\u8239\u575E\u91CD\u65B0\u5F00\u5DE5",
    source: "\u8239\u575E\u6728\u5320",
    goods: ["cedar", "iron", "copper", "wood", "rigging"],
    multiplier: 1.24,
    duration: 7
  },
  {
    kind: "festival",
    headline: "\u96C6\u5E02\u5F00\u59CB\u5E03\u7F6E\u957F\u684C",
    source: "\u96C6\u5E02\u644A\u4E3B",
    goods: ["wine", "oil", "pottery", "silk"],
    multiplier: 1.2,
    duration: 6
  },
  {
    kind: "convoy",
    headline: "\u8D27\u4ED3\u6DF1\u591C\u7684\u706F\u706B",
    source: "\u5546\u961F\u9886\u961F",
    goods: ["porcelain", "silk", "cotton", "pottery", "salt"],
    multiplier: 0.82,
    duration: 7
  },
  {
    kind: "monsoon",
    headline: "\u5F15\u822A\u5458\u4ECD\u5728\u7B49\u98CE",
    source: "\u6E2F\u53E3\u5F15\u822A\u5458",
    goods: ["tea", "coffee", "pepper", "cloves", "copper", "salt", "cedar"],
    multiplier: 1.18,
    duration: 8
  }
];
function targetGoods(template, port2, goods2) {
  if (template.kind === "monsoon" && !["gulf", "indian", "china", "redsea", "southeast"].includes(port2.basin))
    return [];
  const local = template.kind === "harvest" || template.kind === "drought" ? port2.produces : template.kind === "storm" || template.kind === "monsoon" ? port2.demands : [...port2.produces, ...port2.demands];
  return [...new Set(local)].filter((id) => {
    const good2 = goods2.get(id);
    return good2 && (template.goods.includes(id) || template.goods.includes(good2.familyId ?? ""));
  });
}
function hint(kind, goodIds, goods2) {
  const names = goodIds.map((id) => goods2.find((good2) => good2.id === id).name).join("\u3001");
  switch (kind) {
    case "storm":
      return `\u5916\u6D77\u98CE\u6D6A\u8FDE\u65E5\u4E0D\u606F\u3002\u8FD0\u9001${names}\u7684\u51E0\u8258\u5546\u8239\u8FDF\u8FDF\u672A\u8FDB\u6E2F\uFF0C\u4ED3\u5E93\u638C\u67DC\u5DF2\u8FDE\u7EED\u95EE\u4E86\u4E09\u6B21\u8239\u671F\u3002`;
    case "drought":
      return `\u96E8\u5B63\u8FDF\u8FDF\u672A\u5230\u3002${names}\u7684\u6536\u8D27\u4EBA\u7A7A\u7740\u8F66\u56DE\u6765\uFF0C\u8D27\u6808\u638C\u67DC\u628A\u65B0\u7684\u4EA4\u8D27\u5355\u538B\u5728\u4E86\u684C\u89D2\u3002`;
    case "harvest":
      return `\u4ECA\u5E74\u7684\u6536\u6210\u6BD4\u9884\u60F3\u66F4\u597D\u3002\u88C5\u7740${names}\u7684\u8F66\u961F\u6324\u6EE1\u4ED3\u5E93\uFF0C\u8D27\u4E3B\u5F00\u59CB\u62C5\u5FC3\u4E0B\u6279\u8D27\u6CA1\u5730\u65B9\u653E\u3002`;
    case "repairs":
      return `\u6E2F\u53E3\u6B63\u5728\u4FEE\u6574\u65E7\u8239\u575E\u3002\u5DE5\u5320\u4EEC\u4E00\u65E9\u5C31\u4E0A\u4E86\u7801\u5934\uFF0C\u91C7\u8D2D\u5458\u62FF\u7740${names}\u7684\u6E05\u5355\u6328\u5BB6\u6572\u95E8\u3002`;
    case "festival":
      return `\u5E86\u5178\u5C06\u8FD1\uFF0C\u96C6\u5E02\u5F00\u59CB\u9884\u7559\u957F\u684C\u3002\u51E0\u4F4D\u4E3B\u4E8B\u63A5\u8FDE\u95EE\u8D77${names}\uFF0C\u8BF4\u7B49\u8239\u8FDB\u6E2F\u53EF\u80FD\u5C31\u6765\u4E0D\u53CA\u4E86\u3002`;
    case "convoy":
      return `\u4E00\u652F\u6EE1\u8F7D${names}\u7684\u5546\u961F\u521A\u521A\u5165\u6E2F\u3002\u8D27\u4ED3\u706F\u706B\u4EAE\u5230\u6DF1\u591C\uFF0C\u51E0\u4F4D\u8D27\u4E3B\u4E3B\u52A8\u7559\u4F4F\u4E86\u8DEF\u8FC7\u7684\u4E70\u5BB6\u3002`;
    case "monsoon":
      return `\u5B63\u98CE\u6BD4\u9884\u8BA1\u6765\u5F97\u665A\u3002\u88C5\u7740${names}\u7684\u8239\u8FD8\u5728\u8FDC\u5904\u5019\u98CE\uFF0C\u8D27\u94FA\u638C\u67DC\u5F00\u59CB\u6253\u542C\u522B\u5904\u7684\u8D27\u6E90\u3002`;
  }
}
function createMarketEvent(day, ports2, goods2, random) {
  const goodIndex = new Map(goods2.map((good2) => [good2.id, good2]));
  const choices = templates.map((template2) => ({
    template: template2,
    ports: ports2.filter(
      (port3) => targetGoods(template2, port3, goodIndex).length > 0
    )
  })).filter((entry) => entry.ports.length > 0);
  if (!choices.length)
    throw new Error("\u5E02\u573A\u6D88\u606F\u9700\u8981\u81F3\u5C11\u4E00\u4E2A\u53EF\u4EA4\u6613\u6E2F\u53E3\u548C\u5546\u54C1\u3002");
  const choose = (list, key) => {
    const roll = random(key);
    return list[Math.floor(
      Math.max(0, Math.min(0.999999999, Number.isFinite(roll) ? roll : 0)) * list.length
    )];
  };
  const { template, ports: eligible } = choose(choices, "news-kind");
  const port2 = choose(eligible, "news-port");
  const candidates = targetGoods(template, port2, goodIndex);
  const first = candidates.indexOf(choose(candidates, "news-goods"));
  const goodIds = [...candidates.slice(first), ...candidates.slice(0, first)].slice(0, 3);
  const regional = ["storm", "drought", "harvest", "monsoon"].includes(
    template.kind
  );
  const distance = (other) => Math.hypot(
    (other.x - port2.x) * 180 * Math.cos(port2.y * Math.PI / 2),
    (other.y - port2.y) * 90
  );
  const nearby = regional ? eligible.filter(
    (other) => other.id !== port2.id && other.basin === port2.basin && distance(other) <= 9 && goodIds.every(
      (id) => targetGoods(template, other, goodIndex).includes(id)
    )
  ).sort((a, b) => distance(a) - distance(b)).slice(0, 1) : [];
  const affected = [port2, ...nearby];
  return {
    id: `${day}-${port2.id}-${template.kind}`,
    kind: template.kind,
    startDay: day,
    endDay: day + template.duration,
    portIds: affected.map((entry) => entry.id),
    goodIds,
    multiplier: template.multiplier,
    source: `${port2.name} \xB7 ${template.source}`,
    headline: template.headline,
    clue: `${affected.map((entry) => entry.name).join("\u3001")}\uFF1A${hint(template.kind, goodIds, goods2)}${nearby.length ? "\u90BB\u8FD1\u7801\u5934\u4E5F\u4F20\u6765\u76F8\u4F3C\u7684\u6D88\u606F\u3002" : ""}`
  };
}
function marketEventFactor(events, portId, goodId, day) {
  let factor = 1;
  for (const event of events) {
    if (day < event.startDay || day >= event.endDay || !event.portIds.includes(portId) || !event.goodIds.includes(goodId))
      continue;
    const remaining = (event.endDay - day) / (event.endDay - event.startDay);
    factor *= 1 + (event.multiplier - 1) * Math.min(1, remaining * 1.6);
  }
  return Math.max(0.62, Math.min(1.65, factor));
}
function readMarketEvents(value, day, ports2, goods2) {
  if (value === void 0) return [];
  if (!Array.isArray(value) || value.length > 32) return null;
  const text = (v, max) => typeof v === "string" && v.length > 0 && v.length <= max && !/[\u0000-\u001f]/.test(v);
  const ids = (v, known, max) => Array.isArray(v) && v.length > 0 && v.length <= max && new Set(v).size === v.length && v.every(
    (id) => typeof id === "string" && known.some((entry) => entry.id === id)
  );
  const result = [];
  const goodIndex = new Map(goods2.map((good2) => [good2.id, good2]));
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const event = item;
    const template = templates.find((entry) => entry.kind === event.kind);
    if (!template || !text(event.id, 100) || !text(event.headline, 100) || !text(event.clue, 500) || !text(event.source, 100) || !Number.isInteger(event.startDay) || !Number.isInteger(event.endDay) || typeof event.startDay !== "number" || typeof event.endDay !== "number" || event.startDay < 1 || event.startDay > day || event.endDay !== event.startDay + template.duration || !ids(event.portIds, ports2, 2) || !ids(event.goodIds, goods2, 7) || event.multiplier !== template.multiplier || result.some((previous) => previous.id === event.id))
      return null;
    const eventGoodIds = event.goodIds;
    const eventPorts = event.portIds.map(
      (id) => ports2.find((port2) => port2.id === id)
    );
    if (!eventPorts.every(
      (port2) => eventGoodIds.every(
        (id) => targetGoods(template, port2, goodIndex).includes(id)
      )
    ))
      return null;
    if (eventPorts.length > 1 && eventPorts[0].basin !== eventPorts[1].basin)
      return null;
    result.push({
      id: event.id,
      kind: template.kind,
      startDay: event.startDay,
      endDay: event.endDay,
      portIds: [...event.portIds],
      goodIds: [...event.goodIds],
      multiplier: template.multiplier,
      source: event.source,
      headline: event.headline,
      clue: event.clue
    });
  }
  return result;
}

// src/navigation.ts
var edgeBands = /* @__PURE__ */ new Map();
var seaGrid = new Int8Array(360 * 151);
var accessCache = /* @__PURE__ */ new Map();
var routeCache = /* @__PURE__ */ new Map();
var geographyReady = false;
var wrap = (lon) => ((lon + 180) % 360 + 360) % 360 - 180;
var deltaLon = (a, b) => wrap(b - a);
var point = (lon, lat) => ({ lon: wrap(lon), lat });
var portPoint = (port2) => point(port2.x * 180, port2.y * 90);
function isLandPoint(point2) {
  return geographyReady && isLand(point2);
}
function distanceDegrees(a, b) {
  return Math.hypot(
    deltaLon(a.lon, b.lon) * Math.max(0.18, Math.cos((a.lat + b.lat) / 2 * Math.PI / 180)),
    b.lat - a.lat
  );
}
var straits = [
  [point(-6.3, 35.9), point(-4.5, 35.9), 0.58],
  [point(26, 39.8), point(29.2, 41.4), 0.58],
  [point(11, 56.8), point(13.4, 54.5), 0.58],
  [point(43, 12), point(43.9, 13.6), 0.52],
  [point(56, 25.6), point(57.1, 26.6), 0.48],
  [point(99, 5), point(104.6, 1.2), 0.54],
  [point(-75, -52), point(-68, -54), 0.52]
];
function segmentDistance(p, a, b) {
  const x = deltaLon(a.lon, p.lon), y = p.lat - a.lat;
  const dx = deltaLon(a.lon, b.lon), dy = b.lat - a.lat;
  const t = Math.max(
    0,
    Math.min(1, (x * dx + y * dy) / Math.max(1e-5, dx * dx + dy * dy))
  );
  return Math.hypot(x - dx * t, y - dy * t);
}
function naturalChannel(p) {
  return straits.some(([a, b, width]) => segmentDistance(p, a, b) < width);
}
function initializeNavigationGeography(geojson) {
  const data = geojson;
  if (!Array.isArray(data?.features)) throw new Error("\u6D77\u5CB8\u6570\u636E\u683C\u5F0F\u65E0\u6548");
  edgeBands.clear();
  let edges = 0;
  for (const f of data.features) {
    const g = f.geometry;
    const polygons = g?.type === "Polygon" ? [g.coordinates] : g?.type === "MultiPolygon" ? g.coordinates : [];
    if (!Array.isArray(polygons)) continue;
    for (const polygon of polygons) {
      for (const ring of polygon) {
        for (let i = 1; i < ring.length; i++) {
          const [x1, y1] = ring[i - 1], [x2, y2] = ring[i];
          if (![x1, y1, x2, y2].every(Number.isFinite) || Math.abs(x2 - x1) > 180)
            continue;
          const edge = [x1, y1, x2, y2];
          for (let band = Math.floor(Math.min(y1, y2)); band <= Math.floor(Math.max(y1, y2)); band++) {
            const list = edgeBands.get(band) ?? [];
            list.push(edge);
            edgeBands.set(band, list);
          }
          edges++;
        }
      }
    }
  }
  if (!edges) throw new Error("\u6D77\u5CB8\u6570\u636E\u4E3A\u7A7A");
  seaGrid.fill(0);
  accessCache.clear();
  routeCache.clear();
  geographyReady = true;
}
function isLand(p) {
  if (!geographyReady || naturalChannel(p)) return false;
  let inside = false;
  for (const [x1, y1, x2, y2] of edgeBands.get(Math.floor(p.lat)) ?? []) {
    if (y1 > p.lat !== y2 > p.lat && p.lon < (x2 - x1) * (p.lat - y1) / (y2 - y1) + x1)
      inside = !inside;
  }
  return inside;
}
function interpolate(a, b, fraction) {
  return point(
    a.lon + deltaLon(a.lon, b.lon) * fraction,
    a.lat + (b.lat - a.lat) * fraction
  );
}
function clearSea(a, b) {
  if (Math.abs(b.lon - a.lon) > 180) {
    const boundary = a.lon > 0 ? 179.999999 : -179.999999;
    const fraction = (boundary - a.lon) / deltaLon(a.lon, b.lon);
    const latitude = a.lat + (b.lat - a.lat) * fraction;
    return clearSea(a, { lon: boundary, lat: latitude }) && clearSea({ lon: -boundary, lat: latitude }, b);
  }
  const steps = Math.max(
    1,
    Math.ceil(Math.hypot(deltaLon(a.lon, b.lon), b.lat - a.lat) / 0.24)
  );
  for (let i = 0; i <= steps; i++)
    if (isLand(interpolate(a, b, i / steps))) return false;
  const dx = b.lon - a.lon, dy = b.lat - a.lat, visited = /* @__PURE__ */ new Set();
  for (let band = Math.floor(Math.min(a.lat, b.lat)); band <= Math.floor(Math.max(a.lat, b.lat)); band++) {
    for (const edge of edgeBands.get(band) ?? []) {
      if (visited.has(edge)) continue;
      visited.add(edge);
      const [x1, y1, x2, y2] = edge, ex = x2 - x1, ey = y2 - y1;
      const denominator = dx * ey - dy * ex;
      if (Math.abs(denominator) < 1e-8) continue;
      const t = ((x1 - a.lon) * ey - (y1 - a.lat) * ex) / denominator;
      const u = ((x1 - a.lon) * dy - (y1 - a.lat) * dx) / denominator;
      if (t > 0 && t < 1 && u >= 0 && u <= 1 && !naturalChannel(interpolate(a, b, t)))
        return false;
    }
  }
  return true;
}
var riverAccess = {
  nanjing: [[119.5, 32.2], [120.3, 31.9], [121.1, 31.9], [121.9, 31.5], [122.3, 31.4]],
  yangzhou: [[119.5, 32.2], [120.3, 31.9], [121.1, 31.9], [121.9, 31.5], [122.3, 31.4]],
  novgorod: [[32.3, 59.6], [32.3, 60.1], [31.5, 60], [30.5, 59.95], [29.5, 60], [28.8, 59.9]],
  ayutthaya: [[100.5, 13.8], [100.6, 13.5], [100.65, 13.1]],
  satgaon: [[88.2, 22.3], [88.1, 21.95], [88, 21.55], [88, 21.1]],
  bordeaux: [[-0.7, 45], [-0.85, 45.5], [-1.1, 45.7], [-1.5, 45.9]],
  shanghai: [[121.65, 31.35], [121.9, 31.45], [122.25, 31.4]],
  rotterdam: [[4.1, 51.97], [3.9, 52.02]],
  "st-petersburg": [[29.6, 60], [28.8, 59.9]],
  calcutta: [[88.2, 22.3], [88.1, 21.95], [88, 21.55], [88, 21.1]],
  dhaka: [[90.55, 23.4], [90.65, 22.9], [90.65, 22.2], [90.6, 21.4]],
  bangkok: [[100.6, 13.5], [100.65, 13.2], [100.65, 12.8]],
  dagon: [[96.25, 16.5], [96.3, 16.1], [96.25, 15.7]],
  memphis: [
    [31.15, 30.2],
    [30.85, 30.8],
    [30.5, 31.5],
    [30.3, 32]
  ],
  ur: [
    [47.2, 30.8],
    [48.3, 30.1],
    [49, 29.7]
  ],
  basra: [
    [48.2, 30.1],
    [49, 29.7]
  ],
  lothal: [
    [72.35, 22.1],
    [72.35, 21.3],
    [71.9, 20.5]
  ],
  london: [
    [0.5, 51.5],
    [1.5, 51.5],
    [2, 52]
  ],
  quebec: [
    [-69.7, 47.4],
    [-68, 48.4],
    [-65.5, 49.6],
    [-62.5, 49.4]
  ],
  antwerp: [
    [4.1, 51.4],
    [3.3, 51.5],
    [2.5, 52]
  ],
  hamburg: [
    [9.1, 53.8],
    [8.2, 54.1],
    [7.5, 54.5]
  ],
  guangzhou: [
    [113.5, 22.5],
    [113.8, 21.8]
  ],
  hangzhou: [
    [121.1, 30.3],
    [122, 30.3]
  ],
  nantes: [
    [-1.95, 47.2],
    [-2.6, 47]
  ],
  sevilla: [
    [-6, 36.9],
    [-6.5, 36.6]
  ],
  seville: [
    [-6, 36.9],
    [-6.5, 36.6]
  ]
};
function nearestSea(p) {
  if (!isLand(p)) return { ...p };
  for (let radius = 0.25; radius <= 9; radius += 0.25) {
    for (let angle = 0; angle < 32; angle++) {
      const q = point(
        p.lon + Math.sin(angle * Math.PI / 16) * radius,
        p.lat + Math.cos(angle * Math.PI / 16) * radius
      );
      if (q.lat >= -70 && q.lat <= 80 && !isLand(q)) return q;
    }
  }
  return p;
}
function portAccess(port2) {
  const cached = accessCache.get(port2.id);
  if (cached) return cached;
  const path = [
    portPoint(port2),
    ...(riverAccess[port2.id] ?? []).map(([lon, lat]) => point(lon, lat))
  ];
  const sea = nearestSea(path[path.length - 1]);
  if (distanceDegrees(path[path.length - 1], sea) > 1e-3) path.push(sea);
  accessCache.set(port2.id, path);
  return path;
}
function onPortApproach(p) {
  for (const port2 of ports) {
    if (distanceDegrees(p, portPoint(port2)) > (port2.id === "quebec" ? 12 : 7))
      continue;
    const approach = portAccess(port2);
    for (let i = 1; i < approach.length; i++)
      if (segmentDistance(p, approach[i - 1], approach[i]) < 0.3) return true;
  }
  return false;
}
function passable(p) {
  return p.lat >= -70 && p.lat <= 80 && (!isLand(p) || onPortApproach(p));
}
var gridPoint = (id) => point(id % 360 - 180, Math.floor(id / 360) - 70);
var gridId = (lon, lat) => (Math.round(lat) + 70) * 360 + ((Math.round(lon) + 180) % 360 + 360) % 360;
function gridWater(id) {
  if (!seaGrid[id]) seaGrid[id] = isLand(gridPoint(id)) ? -1 : 1;
  return seaGrid[id] === 1;
}
function nearestGrid(p) {
  let best = -1, distance = Infinity;
  for (let r = 1; r <= 5; r++) {
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++) {
        if (p.lat + dy < -70 || p.lat + dy > 80) continue;
        const id = gridId(p.lon + dx, p.lat + dy), q = gridPoint(id), d = distanceDegrees(p, q);
        if (d < distance && gridWater(id) && clearSea(p, q)) {
          best = id;
          distance = d;
        }
      }
    if (best !== -1) return best;
  }
  return -1;
}
var MinHeap = class {
  entries = [];
  get length() {
    return this.entries.length;
  }
  push(id, score) {
    const item = { id, score };
    this.entries.push(item);
    let n = this.entries.length - 1;
    while (n > 0) {
      const parent = n - 1 >> 1;
      if (this.entries[parent].score <= score) break;
      this.entries[n] = this.entries[parent];
      n = parent;
    }
    this.entries[n] = item;
  }
  pop() {
    const first = this.entries[0], last = this.entries.pop();
    if (this.entries.length) {
      let n = 0;
      while (n * 2 + 1 < this.entries.length) {
        let child = n * 2 + 1;
        if (child + 1 < this.entries.length && this.entries[child + 1].score < this.entries[child].score)
          child++;
        if (this.entries[child].score >= last.score) break;
        this.entries[n] = this.entries[child];
        n = child;
      }
      this.entries[n] = last;
    }
    return first.id;
  }
};
function seaPath(from, to, useGulfApproach = true) {
  if (clearSea(from, to)) return [from, to];
  if (useGulfApproach) {
    const entrance = point(22, 59.4);
    const inGulf = (p) => p.lon > 23 && p.lon < 31 && p.lat > 59 && p.lat < 61;
    if (inGulf(to) && clearSea(entrance, to)) {
      const approach = seaPath(from, entrance, false);
      if (approach.length) return [...approach, to];
    }
    if (inGulf(from) && clearSea(from, entrance)) {
      const departure = seaPath(entrance, to, false);
      if (departure.length) return [from, ...departure];
    }
  }
  const start = nearestGrid(from), goal = nearestGrid(to);
  if (start < 0 || goal < 0) return [];
  const previous = new Int32Array(seaGrid.length).fill(-1);
  const cost = new Float64Array(seaGrid.length).fill(Infinity);
  const closed = new Uint8Array(seaGrid.length);
  const heap = new MinHeap();
  cost[start] = 0;
  heap.push(start, distanceDegrees(from, to));
  while (heap.length) {
    const id = heap.pop();
    if (closed[id]) continue;
    if (id === goal) {
      const path = [to];
      let cursor = goal;
      while (cursor !== -1) {
        path.push(gridPoint(cursor));
        cursor = previous[cursor];
      }
      path.push(from);
      path.reverse();
      const smooth = [path[0]];
      let i = 0;
      while (i < path.length - 1) {
        let next = Math.min(path.length - 1, i + 24);
        while (next > i + 1 && !clearSea(path[i], path[next])) next--;
        smooth.push(path[next]);
        i = next;
      }
      return smooth;
    }
    closed[id] = 1;
    const here = gridPoint(id);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        if (!dx && !dy || here.lat + dy < -70 || here.lat + dy > 80) continue;
        const next = gridId(here.lon + dx, here.lat + dy);
        if (closed[next] || !gridWater(next)) continue;
        const q = gridPoint(next), nextCost = cost[id] + distanceDegrees(here, q);
        if (nextCost >= cost[next] || !clearSea(here, q)) continue;
        cost[next] = nextCost;
        previous[next] = id;
        heap.push(next, nextCost + distanceDegrees(q, to) * 0.85);
      }
  }
  return [];
}
function planSeaRoute(from, to) {
  if (!geographyReady) return [];
  const cacheKey = `${from.lon.toFixed(5)},${from.lat.toFixed(5)}:${to.id}:${to.x.toFixed(5)},${to.y.toFixed(5)}`;
  const cached = routeCache.get(cacheKey);
  if (cached) return cached.map((p) => ({ ...p }));
  const origin = ports.find((p) => distanceDegrees(from, portPoint(p)) < 0.05);
  let depart = origin ? [from, ...portAccess(origin).slice(1)] : [from];
  if (!origin && isLand(from)) {
    let best = Infinity;
    for (const port2 of ports) {
      if (distanceDegrees(from, portPoint(port2)) > 12) continue;
      const access = portAccess(port2);
      for (let i = 1; i < access.length; i++) {
        const distance = segmentDistance(from, access[i - 1], access[i]);
        if (distance < 0.32 && distance < best) {
          best = distance;
          depart = [from, ...access.slice(i)];
        }
      }
    }
  }
  const arrival = portAccess(to);
  const middle = seaPath(
    depart[depart.length - 1],
    arrival[arrival.length - 1]
  );
  if (!middle.length) return [];
  const path = [
    from,
    ...depart.slice(1),
    ...middle.slice(1),
    ...arrival.slice(0, -1).reverse()
  ];
  const result = path.filter((p, i) => !i || distanceDegrees(p, path[i - 1]) > 1e-3).map((p) => ({ ...p }));
  if (routeCache.size > 240) routeCache.delete(routeCache.keys().next().value);
  routeCache.set(cacheKey, result);
  return result.map((p) => ({ ...p }));
}
function createNavigation(port2, _day) {
  return {
    position: portPoint(port2),
    heading: 0,
    manual: false,
    throttle: 1,
    route: [],
    leg: 0,
    trail: [portPoint(port2)],
    discovered: [port2.id],
    targetId: null,
    distanceSailed: 0
  };
}
function bearing(a, b) {
  return Math.atan2(
    deltaLon(a.lon, b.lon) * Math.cos((a.lat + b.lat) / 2 * Math.PI / 180),
    b.lat - a.lat
  );
}
function navigationHazards(day) {
  const epoch = Math.floor(Math.max(0, day) / 6);
  const sites = [
    [24, 34, "storm", "\u7231\u7434\u6D77\u9635\u98CE"],
    [16, 36, "pirate", "\u897F\u897F\u91CC\u53EF\u7591\u5E06\u5F71"],
    [-14, 41, "storm", "\u5317\u5927\u897F\u6D0B\u98CE\u66B4"],
    [-35, 28, "current", "\u5927\u897F\u6D0B\u6D0B\u6D41"],
    [-65, 20, "pirate", "\u52A0\u52D2\u6BD4\u6D77\u76D7\u6D3B\u52A8"],
    [-75, 37, "fog", "\u897F\u5927\u897F\u6D0B\u6D77\u96FE"],
    [43, 13, "pirate", "\u66FC\u5FB7\u6D77\u5CE1\u52AB\u63A0\u8239"],
    [58, 23, "storm", "\u963F\u62C9\u4F2F\u6D77\u6D8C\u6D6A"],
    [69, 13, "current", "\u5370\u5EA6\u6D0B\u5B63\u98CE\u6D41"],
    [95, 8, "storm", "\u5B5F\u52A0\u62C9\u6E7E\u98CE\u66B4"],
    [103, 2, "pirate", "\u6D77\u5CE1\u964C\u751F\u8239\u961F"],
    [118, 21, "storm", "\u5357\u6D77\u70ED\u5E26\u98CE\u66B4"],
    [130, 34, "fog", "\u4E1C\u6D77\u6D53\u96FE"],
    [18, -38, "storm", "\u597D\u671B\u89D2\u5927\u6D6A"],
    [-69, -57, "current", "\u5408\u6069\u89D2\u5F3A\u6D41"],
    [151, -18, "fog", "\u73CA\u745A\u6D77\u6D77\u96FE"]
  ];
  return sites.map(([lon, lat, kind, label], i) => ({
    id: `${kind}-${i}-${epoch}`,
    kind,
    lon: wrap(lon + Math.sin(epoch * 1.7 + i) * 2),
    lat: lat + Math.cos(epoch * 0.9 + i * 2) * 1.4,
    radius: kind === "pirate" ? 3.4 : kind === "storm" ? 5 : 4,
    strength: 0.5 + (Math.sin(epoch + i * 1.2) + 1) * 0.23,
    label
  }));
}
function advanceNavigation(nav, distance, day) {
  if (!Number.isFinite(distance) || distance <= 0 || !geographyReady)
    return { reached: false, blocked: false };
  let budget = Math.min(distance, 180) * (nav.manual ? Math.max(0, Math.min(1, nav.throttle)) : 1);
  const hazards = navigationHazards(day);
  for (const hazard of hazards)
    if (distanceDegrees(nav.position, hazard) < hazard.radius)
      budget *= hazard.kind === "current" ? 1.16 : hazard.kind === "storm" ? 0.7 : hazard.kind === "fog" ? 0.82 : 1;
  let moved = 0, blocked = false;
  while (budget > 1e-6) {
    if (!nav.manual && nav.leg >= nav.route.length) break;
    const goal = nav.manual ? point(
      nav.position.lon + Math.sin(nav.heading) * 0.2 / Math.max(0.18, Math.cos(nav.position.lat * Math.PI / 180)),
      nav.position.lat + Math.cos(nav.heading) * 0.2
    ) : nav.route[nav.leg];
    const remaining = distanceDegrees(nav.position, goal);
    if (remaining < 1e-5) {
      if (!nav.manual) nav.leg++;
      else break;
      continue;
    }
    const step = Math.min(remaining, budget, 0.12);
    const next = interpolate(nav.position, goal, step / remaining);
    if (!passable(next)) {
      blocked = true;
      break;
    }
    nav.heading = bearing(nav.position, next);
    nav.position = next;
    budget -= step;
    moved += step;
    if (!nav.manual && step >= remaining - 1e-5) nav.leg++;
  }
  nav.distanceSailed += moved;
  if (moved > 0 && (!nav.trail.length || distanceDegrees(nav.trail[nav.trail.length - 1], nav.position) > 0.18))
    nav.trail.push({ ...nav.position });
  if (nav.trail.length > 500) nav.trail.splice(0, nav.trail.length - 500);
  return {
    reached: !nav.manual && nav.route.length > 0 && nav.leg >= nav.route.length,
    blocked
  };
}
function readNavigation(raw, fallbackPort, unlockedPorts) {
  if (raw === void 0 || raw === null)
    return createNavigation(fallbackPort, 0);
  if (typeof raw !== "object") return null;
  const n = raw;
  const validPoint = (p) => !!p && typeof p === "object" && Number.isFinite(p.lon) && Math.abs(p.lon) <= 180 && Number.isFinite(p.lat) && p.lat >= -70 && p.lat <= 80;
  const validList = (items, max) => Array.isArray(items) && items.length <= max && items.every(validPoint);
  const ids = new Set(unlockedPorts.map((p) => p.id));
  if (!validPoint(n.position) || !Number.isFinite(n.heading) || Math.abs(n.heading) > 1e3 || typeof n.manual !== "boolean" || !Number.isFinite(n.throttle) || n.throttle < 0 || n.throttle > 1 || !validList(n.route, 1e3) || !Number.isInteger(n.leg) || n.leg < 0 || n.leg > n.route.length || !validList(n.trail, 500) || !Array.isArray(n.discovered) || n.discovered.length > ports.length || n.discovered.some((id) => typeof id !== "string" || !ids.has(id)) || n.targetId !== null && !ids.has(n.targetId) || !Number.isFinite(n.distanceSailed) || n.distanceSailed < 0)
    return null;
  return {
    ...n,
    position: { ...n.position },
    route: n.route.map((p) => ({ ...p })),
    trail: n.trail.map((p) => ({ ...p })),
    discovered: [...new Set(n.discovered)]
  };
}

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

// src/inland-catalog.ts
var records = `
dongguan|\u4E1C\u839E|\u73E0\u6C5F\u4E09\u89D2\u6D32|9|113.75|23.02|xinan guangzhou
hamar|\u54C8\u9A6C\u5C14|\u632A\u5A01\u5185\u9646\u6E56\u533A|6|11.07|60.79|oslo
hameenlinna|\u6D77\u95E8\u6797\u7EB3|\u82AC\u5170\u6E56\u533A|9|24.47|61.00|helsinki
beijing|\u5317\u4EAC|\u534E\u5317\u5E73\u539F|5|116.40|39.90|jinan tianjin datong
tianjin|\u5929\u6D25|\u6D77\u6CB3\u5E73\u539F|7|117.20|39.13|beijing jinan
taiyuan|\u592A\u539F|\u6C7E\u6CB3\u8C37\u5730|5|112.55|37.87|datong luoyang
datong|\u5927\u540C|\u664B\u5317|6|113.30|40.08|beijing taiyuan
jinan|\u6D4E\u5357|\u5C71\u4E1C|5|117.12|36.65|dengzhou kaifeng
kaifeng|\u5F00\u5C01|\u9EC4\u6CB3\u4E2D\u4E0B\u6E38|5|114.31|34.80|luoyang xuzhou
anyang|\u5B89\u9633|\u4E2D\u539F\u5317\u90E8|5|114.39|36.10|kaifeng taiyuan
xuzhou|\u5F90\u5DDE|\u6DEE\u6D77\u5E73\u539F|5|117.28|34.20|yangzhou kaifeng
suzhou|\u82CF\u5DDE|\u6C5F\u5357|6|120.59|31.30|hangzhou yangzhou shanghai
hefei|\u5408\u80A5|\u6C5F\u6DEE|7|117.23|31.82|nanjing nanchang
nanchang|\u5357\u660C|\u9131\u9633\u6E56\u5E73\u539F|6|115.86|28.68|jingdezhen changsha
changsha|\u957F\u6C99|\u6E58\u6C5F\u8C37\u5730|5|112.94|28.23|guangzhou guilin
guilin|\u6842\u6797|\u6842\u4E1C\u5317|5|110.30|25.27|guangzhou changsha kunming
kunming|\u6606\u660E|\u6EC7\u6C60\u76C6\u5730|7|102.83|24.88|guilin dali
dali|\u5927\u7406|\u6D31\u6D77\u76C6\u5730|6|100.23|25.60|kunming chengdu
lanzhou|\u5170\u5DDE|\u9EC4\u6CB3\u4E0A\u6E38|5|103.83|36.06|changan dunhuang
dunhuang|\u6566\u714C|\u6CB3\u897F\u8D70\u5ECA|5|94.66|40.14|lanzhou turpan
turpan|\u5410\u9C81\u756A|\u5410\u9C81\u756A\u76C6\u5730|6|89.19|42.95|dunhuang kashgar
kashgar|\u5580\u4EC0|\u5854\u91CC\u6728\u76C6\u5730\u897F\u90E8|6|75.99|39.47|turpan khotan samarkand
khotan|\u548C\u7530|\u6606\u4ED1\u5C71\u5317\u9E93|6|79.93|37.11|kashgar
lhasa|\u62C9\u8428|\u62C9\u8428\u6CB3\u8C37|6|91.13|29.65|chengdu kathmandu
yinchuan|\u5174\u5E86\u5E9C|\u5B81\u590F\u5E73\u539F|6|106.23|38.49|lanzhou taiyuan
hohhot|\u5F52\u5316\u57CE|\u571F\u9ED8\u5DDD|9|111.75|40.84|datong
lahore|\u62C9\u5408\u5C14|\u65C1\u906E\u666E|6|74.36|31.55|multan delhi
multan|\u6728\u5C14\u5766|\u5370\u5EA6\u6CB3\u652F\u6D41\u5E73\u539F|3|71.47|30.20|mohenjo-daro taxila karachi
taxila|\u5854\u514B\u897F\u62C9|\u728D\u9640\u7F57|3|72.84|33.75|multan kabul
kabul|\u5580\u5E03\u5C14|\u5174\u90FD\u5E93\u4EC0\u5357\u9E93|6|69.17|34.56|taxila balkh
balkh|\u5DF4\u5C14\u8D6B|\u5DF4\u514B\u7279\u91CC\u4E9A|6|66.90|36.76|samarkand herat
agra|\u963F\u683C\u62C9|\u4E9A\u7A46\u7EB3\u6CB3|6|78.01|27.18|delhi varanasi
varanasi|\u74E6\u62C9\u7EB3\u897F|\u6052\u6CB3\u4E2D\u6E38|6|82.97|25.32|pataliputra agra
jaipur|\u658B\u6D66\u5C14|\u62C9\u8D3E\u65AF\u5766|10|75.79|26.91|agra ahmedabad
ahmedabad|\u827E\u54C8\u8FC8\u8FBE\u5DF4\u5FB7|\u53E4\u5409\u62C9\u7279|7|72.57|23.02|cambay ujjain
srinagar|\u65AF\u5229\u90A3\u52A0|\u514B\u4EC0\u7C73\u5C14\u8C37\u5730|6|74.80|34.08|lahore taxila
hyderabad|\u6D77\u5F97\u62C9\u5DF4|\u5FB7\u5E72\u9AD8\u539F|9|78.49|17.39|masulipatnam bijapur
bijapur|\u6BD4\u8D3E\u5E03\u5C14|\u5FB7\u5E72\u897F\u90E8|7|75.71|16.83|goa mysore bombay
mysore|\u8FC8\u7D22\u5C14|\u5361\u7EB3\u5854\u514B|7|76.64|12.30|calicut bangalore
bangalore|\u73ED\u52A0\u7F57\u5C14|\u5361\u7EB3\u5854\u514B\u9AD8\u539F|8|77.59|12.97|mysore kanchipuram
thanjavur|\u5766\u8D3E\u6B66\u5C14|\u9AD8\u97E6\u91CC\u4E09\u89D2\u6D32|6|79.14|10.79|nagapattinam madurai
kanchipuram|\u5EFA\u5FD7\u8865\u7F57|\u6CF0\u7C73\u5C14\u5317\u90E8|8|79.70|12.83|pulicat thanjavur madras
anuradhapura|\u963F\u52AA\u62C9\u5FB7\u666E\u52D2|\u65AF\u91CC\u5170\u5361\u5185\u9646|6|80.39|8.31|colombo kandy
kandy|\u5EB7\u63D0|\u65AF\u91CC\u5170\u5361\u9AD8\u5730|7|80.63|7.29|colombo galle
kathmandu|\u52A0\u5FB7\u6EE1\u90FD|\u5C3C\u6CCA\u5C14\u8C37\u5730|6|85.32|27.72|varanasi
thimphu|\u5EF7\u5E03|\u559C\u9A6C\u62C9\u96C5\u5357\u5761|9|89.64|27.47|kathmandu pataliputra
bagan|\u84B2\u7518|\u4F0A\u6D1B\u74E6\u5E95\u6C5F\u8C37\u5730|6|94.86|21.17|pegu ava dagon
ava|\u963F\u74E6|\u7F05\u7538\u4E2D\u90E8|7|95.98|21.85|bagan
chiangmai|\u6E05\u8FC8|\u6CF0\u5317\u5C71\u95F4\u76C6\u5730|7|98.98|18.79|sukhothai luang-prabang
sukhothai|\u7D20\u53EF\u6CF0|\u6CF0\u56FD\u4E2D\u5317\u90E8|7|99.82|17.01|ayutthaya chiangmai bangkok
angkor|\u5434\u54E5|\u6D1E\u91CC\u8428\u6E56\u5E73\u539F|7|103.87|13.41|ayutthaya phnom-penh
phnom-penh|\u91D1\u8FB9|\u6E44\u516C\u6CB3\u4E0B\u6E38|8|104.93|11.56|angkor saigon
luang-prabang|\u7405\u52C3\u62C9\u90A6|\u6E44\u516C\u6CB3\u4E0A\u6E38|7|102.14|19.89|chiangmai vientiane
vientiane|\u4E07\u8C61|\u6E44\u516C\u6CB3\u8C37\u5730|7|102.63|17.98|luang-prabang hue
hanoi|\u5347\u9F99|\u7EA2\u6CB3\u4E09\u89D2\u6D32|8|105.85|21.03|hue hoi-an
hue|\u987A\u5316|\u8D8A\u5357\u4E2D\u90E8|8|107.59|16.46|hoi-an
saigon|\u5609\u5B9A|\u6E44\u516C\u6CB3\u4E09\u89D2\u6D32\u4E1C\u7F18|9|106.70|10.78|phnom-penh hoi-an
bandung|\u4E07\u9686|\u722A\u54C7\u897F\u90E8\u9AD8\u5730|9|107.62|-6.92|batavia banten
surakarta|\u68AD\u7F57|\u722A\u54C7\u4E2D\u90E8|10|110.83|-7.57|gresik bandung
seoul|\u6C49\u57CE|\u671D\u9C9C\u534A\u5C9B\u4E2D\u897F\u90E8|7|126.98|37.57|busan jeonju
jeonju|\u5168\u5DDE|\u671D\u9C9C\u534A\u5C9B\u897F\u5357\u90E8|7|127.15|35.82|busan seoul
nara|\u5948\u826F|\u65E5\u672C\u5927\u548C\u76C6\u5730|7|135.80|34.68|sakai kyoto
osaka|\u5927\u962A|\u65E5\u672C\u6444\u6D25|7|135.50|34.69|sakai kyoto
nagoya|\u540D\u53E4\u5C4B|\u65E5\u672C\u5C3E\u5F20|9|136.91|35.18|kyoto edo
edo|\u6C5F\u6237|\u65E5\u672C\u5173\u4E1C|9|139.69|35.69|nagoya
tashkent|\u5854\u4EC0\u5E72|\u4E2D\u4E9A\u7EFF\u6D32|6|69.24|41.30|samarkand kashgar
herat|\u8D6B\u62C9\u7279|\u54C8\u91CC\u6CB3\u8C37|6|62.20|34.35|mashhad balkh
isfahan|\u4F0A\u65AF\u6CD5\u7F55|\u4F0A\u6717\u9AD8\u539F\u4E2D\u90E8|4|51.68|32.65|persepolis ecbatana
shiraz|\u8BBE\u62C9\u5B50|\u6CD5\u5C14\u65AF|4|52.58|29.59|persepolis siraf
mashhad|\u9A6C\u4EC0\u54C8\u5FB7|\u547C\u7F57\u73CA|6|59.62|36.30|ecbatana herat
tabriz|\u5927\u4E0D\u91CC\u58EB|\u4F0A\u6717\u897F\u5317\u90E8|5|46.29|38.08|ecbatana erzurum
qazvin|\u52A0\u5179\u6E29|\u5384\u5C14\u5E03\u5C14\u58EB\u5C71\u5357\u9E93|6|50.00|36.27|tabriz isfahan
tehran|\u5FB7\u9ED1\u5170|\u4F0A\u6717\u9AD8\u539F\u5317\u7F18|9|51.39|35.69|qazvin mashhad
ankara|\u5B89\u5361\u62C9|\u5B89\u7EB3\u6258\u5229\u4E9A\u4E2D\u90E8|3|32.86|39.93|sinope hattusa
konya|\u79D1\u5C3C\u4E9A|\u5B89\u7EB3\u6258\u5229\u4E9A\u5357\u90E8|4|32.49|37.87|ankara smyrna
erzurum|\u57C3\u5C14\u7956\u9C81\u59C6|\u5B89\u7EB3\u6258\u5229\u4E9A\u4E1C\u90E8|4|41.27|39.90|trebizond tabriz
jerusalem|\u8036\u8DEF\u6492\u51B7|\u72B9\u592A\u5C71\u5730|2|35.21|31.77|jaffa damascus
amman|\u5B89\u66FC|\u7EA6\u65E6\u9AD8\u5730|2|35.91|31.95|damascus jerusalem
mosul|\u6469\u82CF\u5C14|\u5E95\u683C\u91CC\u65AF\u6CB3|4|43.12|36.34|nineveh baghdad
baghdad|\u5DF4\u683C\u8FBE|\u4E24\u6CB3\u4E2D\u90E8|5|44.37|33.32|basra babylon kuwait
mecca|\u9EA6\u52A0|\u6C49\u5FD7|5|39.86|21.42|jeddah medina
medina|\u9EA6\u5730\u90A3|\u6C49\u5FD7\u7EFF\u6D32|5|39.61|24.47|jeddah mecca
sanaa|\u8428\u90A3|\u4E5F\u95E8\u9AD8\u5730|5|44.21|15.37|aden taiz
taiz|\u5854\u4F0A\u5179|\u4E5F\u95E8\u5C71\u5730|5|44.02|13.58|aden mocha
diriyah|\u5FB7\u62C9\u4F0A\u8036|\u5185\u5FD7\u7EFF\u6D32|8|46.58|24.74|medina
madrid|\u9A6C\u5FB7\u91CC|\u4F0A\u6BD4\u5229\u4E9A\u4E2D\u90E8|8|-3.70|40.42|toledo salamanca
toledo|\u6258\u83B1\u591A|\u5854\u970D\u6CB3|6|-4.03|39.86|malaga burgos
granada|\u683C\u62C9\u7EB3\u8FBE|\u5B89\u8FBE\u5362\u897F\u4E9A|6|-3.60|37.18|malaga cordoba
salamanca|\u8428\u62C9\u66FC\u5361|\u5361\u65AF\u8482\u5229\u4E9A|6|-5.66|40.97|porto toledo
burgos|\u5E03\u5C14\u6208\u65AF|\u5361\u65AF\u8482\u5229\u4E9A\u5317\u90E8|6|-3.70|42.34|barcelona toledo
toulouse|\u56FE\u5362\u5179|\u52A0\u9F99\u6CB3\u8C37|6|1.44|43.60|bordeaux marseille
avignon|\u963F\u7EF4\u5C3C\u7FC1|\u7F57\u8BB7\u6CB3|6|4.81|43.95|marseille lyon
reims|\u5170\u65AF|\u9999\u69DF|6|4.03|49.26|paris strasbourg
strasbourg|\u65AF\u7279\u62C9\u65AF\u5821|\u83B1\u8335\u6CB3\u8C37|6|7.75|48.58|paris frankfurt
zurich|\u82CF\u9ECE\u4E16|\u745E\u58EB\u9AD8\u539F|6|8.54|47.38|milan augsburg
bern|\u4F2F\u5C14\u5C3C|\u745E\u58EB\u9AD8\u539F\u897F\u90E8|6|7.45|46.95|lyon zurich
vienna|\u7EF4\u4E5F\u7EB3|\u591A\u7459\u6CB3|6|16.37|48.21|venice budapest prague
prague|\u5E03\u62C9\u683C|\u6CE2\u5E0C\u7C73\u4E9A|6|14.42|50.08|nuremberg berlin
frankfurt|\u6CD5\u5170\u514B\u798F|\u7F8E\u56E0\u6CB3|6|8.68|50.11|bremen cologne nuremberg
nuremberg|\u7EBD\u4F26\u5821|\u6CD5\u5170\u514B\u5C3C\u4E9A|6|11.08|49.45|munich prague
cologne|\u79D1\u9686|\u83B1\u8335\u6CB3|6|6.96|50.94|bruges antwerp rotterdam
munich|\u6155\u5C3C\u9ED1|\u5DF4\u4F10\u5229\u4E9A|6|11.58|48.14|venice augsburg
augsburg|\u5965\u683C\u65AF\u5821|\u65BD\u74E6\u672C|6|10.90|48.37|munich zurich
berlin|\u67CF\u6797|\u52C3\u5170\u767B\u5821|6|13.40|52.52|hamburg gdansk rostock
warsaw|\u534E\u6C99|\u7EF4\u65AF\u74E6\u6CB3|6|21.01|52.23|gdansk krakow
krakow|\u514B\u62C9\u79D1\u592B|\u6CE2\u5170\u5357\u90E8|6|19.94|50.06|warsaw budapest
budapest|\u5E03\u8FBE\u4E0E\u4F69\u65AF|\u591A\u7459\u6CB3\u4E2D\u6E38|6|19.04|47.50|split belgrade vienna
belgrade|\u8D1D\u5C14\u683C\u83B1\u5FB7|\u8428\u74E6\u6CB3\u53E3|6|20.46|44.82|ragusa sofia
sofia|\u7D22\u83F2\u4E9A|\u5DF4\u5C14\u5E72\u5185\u9646|4|23.32|42.70|thessaloniki constantinople
bucharest|\u5E03\u52A0\u52D2\u65AF\u7279|\u74E6\u62C9\u51E0\u4E9A|7|26.10|44.43|sofia belgrade
kyiv|\u57FA\u8F85|\u7B2C\u8042\u4F2F\u6CB3|6|30.52|50.45|smolensk minsk
smolensk|\u65AF\u6469\u68F1\u65AF\u514B|\u7B2C\u8042\u4F2F\u6CB3\u4E0A\u6E38|6|32.05|54.78|novgorod moscow st-petersburg
moscow|\u83AB\u65AF\u79D1|\u83AB\u65AF\u79D1\u6CB3|6|37.62|55.75|novgorod smolensk
vilnius|\u7EF4\u5C14\u7EBD\u65AF|\u7ACB\u9676\u5B9B\u5185\u9646|6|25.28|54.69|riga minsk
minsk|\u660E\u65AF\u514B|\u767D\u4FC4\u7F57\u65AF|6|27.56|53.90|vilnius smolensk
york|\u7EA6\u514B|\u82F1\u683C\u5170\u5317\u90E8|6|-1.08|53.96|bristol edinburgh
oxford|\u725B\u6D25|\u82F1\u683C\u5170\u4E2D\u5357\u90E8|6|-1.26|51.75|bristol london
cambridge|\u5251\u6865|\u82F1\u683C\u5170\u4E1C\u90E8|10|0.12|52.21|london york
stirling|\u65AF\u7279\u7075|\u82CF\u683C\u5170\u4E2D\u90E8|6|-3.94|56.12|edinburgh
marrakech|\u9A6C\u62C9\u5580\u4EC0|\u963F\u7279\u62C9\u65AF\u5C71\u5317\u9E93|6|-7.98|31.63|tangier fez anfa
meknes|\u6885\u514B\u5185\u65AF|\u6469\u6D1B\u54E5\u5185\u9646|6|-5.55|33.89|fez tangier
tlemcen|\u7279\u83B1\u59C6\u68EE|\u963F\u5C14\u53CA\u5229\u4E9A\u897F\u90E8|6|-1.32|34.88|algiers fez
constantine|\u541B\u58EB\u5766\u4E01|\u963F\u5C14\u53CA\u5229\u4E9A\u4E1C\u5317\u90E8|6|6.61|36.36|tunis algiers
kairouan|\u51EF\u9C81\u4E07|\u7A81\u5C3C\u65AF\u5185\u9646|5|10.10|35.68|tunis tripoli
ghadames|\u76D6\u8FBE\u7C73\u65AF|\u6492\u54C8\u62C9\u5317\u7F18|6|9.50|30.13|tripoli kairouan
sijilmasa|\u9521\u5409\u52D2\u9A6C\u8428|\u6492\u54C8\u62C9\u7EFF\u6D32|8|-4.25|31.28|marrakech arguin
timbuktu|\u5EF7\u5DF4\u514B\u56FE|\u5C3C\u65E5\u5C14\u6CB3\u5317\u5CB8|8|-3.00|16.77|sijilmasa gao djenne
gao|\u52A0\u5965|\u5C3C\u65E5\u5C14\u6CB3\u4E2D\u6E38|8|-0.05|16.27|timbuktu kano
djenne|\u6770\u5185|\u5C3C\u65E5\u5C14\u6CB3\u5185\u4E09\u89D2\u6D32|8|-4.55|13.91|timbuktu bamako
bamako|\u5DF4\u9A6C\u79D1|\u5C3C\u65E5\u5C14\u6CB3\u4E0A\u6E38|8|-8.00|12.64|djenne
kano|\u5361\u8BFA|\u8C6A\u8428\u5730\u533A|8|8.52|12.00|benin oyo
oyo|\u5965\u7EA6|\u7EA6\u9C81\u5DF4\u5185\u9646|8|3.92|8.15|benin accra lagos
abomey|\u963F\u6CE2\u7F8E|\u897F\u975E\u5185\u9646|9|1.98|7.18|accra oyo
kumasi|\u5E93\u9A6C\u897F|\u897F\u975E\u68EE\u6797\u5E26|9|-1.62|6.69|accra elmina
aksum|\u963F\u514B\u82CF\u59C6|\u57C3\u585E\u4FC4\u6BD4\u4E9A\u9AD8\u539F|4|38.72|14.12|adulis lalibela
lalibela|\u62C9\u5229\u8D1D\u62C9|\u57C3\u585E\u4FC4\u6BD4\u4E9A\u9AD8\u539F\u4E2D\u90E8|6|39.05|12.03|aksum gondar
gondar|\u8D21\u5FB7\u5C14|\u57C3\u585E\u4FC4\u6BD4\u4E9A\u9AD8\u539F\u897F\u90E8|9|37.47|12.60|massawa lalibela
harar|\u54C8\u52D2\u5C14|\u975E\u6D32\u4E4B\u89D2\u9AD8\u5730|6|42.12|9.31|mogadishu aksum
great-zimbabwe|\u5927\u6D25\u5DF4\u5E03\u97E6|\u975E\u6D32\u4E1C\u5357\u90E8\u9AD8\u539F|6|30.93|-20.27|sofala delagoa
mbanza-kongo|\u59C6\u73ED\u624E\u521A\u679C|\u521A\u679C\u5185\u9646|8|14.24|-6.27|bonny luanda
quito|\u57FA\u591A|\u5B89\u7B2C\u65AF\u5317\u90E8|8|-78.47|-0.18|guayaquil cuenca-ecuador
cuenca-ecuador|\u6606\u5361|\u5384\u74DC\u591A\u5C14\u9AD8\u5730|8|-79.00|-2.90|guayaquil quito
bogota|\u6CE2\u54E5\u5927|\u54E5\u4F26\u6BD4\u4E9A\u9AD8\u539F|8|-74.07|4.71|cartagena medellin
medellin|\u9EA6\u5FB7\u6797|\u963F\u5E03\u62C9\u8C37\u5730|9|-75.56|6.24|cartagena bogota
arequipa|\u963F\u96F7\u57FA\u5E15|\u79D8\u9C81\u5357\u90E8\u9AD8\u5730|8|-71.54|-16.40|callao cusco
la-paz|\u62C9\u5DF4\u65AF|\u5B89\u7B2C\u65AF\u9AD8\u539F|8|-68.15|-16.50|cusco potosi
potosi|\u6CE2\u6258\u897F|\u5B89\u7B2C\u65AF\u77FF\u533A|8|-65.75|-19.59|la-paz sucre
sucre|\u62C9\u666E\u62C9\u5854|\u73BB\u5229\u7EF4\u4E9A\u9AD8\u5730|8|-65.26|-19.04|potosi salta
salta|\u8428\u5C14\u5854|\u5357\u7F8E\u897F\u5317\u90E8|8|-65.41|-24.79|tucuman potosi
tucuman|\u56FE\u5E93\u66FC|\u5357\u7F8E\u5185\u9646|8|-65.20|-26.81|cordoba-argentina buenos-aires
cordoba-argentina|\u79D1\u5C14\u591A\u74E6\u65B0\u57CE|\u62C9\u666E\u62C9\u5854\u5185\u9646|8|-64.18|-31.42|buenos-aires
asuncion|\u4E9A\u677E\u68EE|\u5DF4\u62C9\u572D\u6CB3|8|-57.64|-25.26|buenos-aires
santiago-chile|\u5723\u5730\u4E9A\u54E5|\u667A\u5229\u4E2D\u592E\u8C37\u5730|8|-70.67|-33.45|valparaiso
sao-paulo|\u5723\u4FDD\u7F57|\u5DF4\u897F\u9AD8\u539F\u4E1C\u7F18|8|-46.63|-23.55|rio
ouro-preto|\u7EF4\u62C9\u91CC\u5361|\u5DF4\u897F\u77FF\u533A|9|-43.51|-20.38|rio sao-paulo
puebla|\u666E\u57C3\u5E03\u62C9|\u58A8\u897F\u54E5\u9AD8\u539F\u4E1C\u7F18|8|-98.20|19.04|veracruz mexico-city
oaxaca|\u74E6\u54C8\u5361|\u58A8\u897F\u54E5\u5357\u90E8\u9AD8\u539F|8|-96.73|17.07|acapulco puebla
guadalajara|\u74DC\u8FBE\u62C9\u54C8\u62C9|\u58A8\u897F\u54E5\u897F\u90E8|8|-103.35|20.68|mexico-city
morelia|\u5DF4\u5229\u4E9A\u591A\u5229\u5FB7|\u58A8\u897F\u54E5\u4E2D\u90E8|8|-101.19|19.70|mexico-city guadalajara
merida|\u6885\u91CC\u8FBE|\u5C24\u5361\u5766\u534A\u5C9B|8|-89.59|20.97|veracruz guatemala
guatemala|\u5371\u5730\u9A6C\u62C9\u57CE|\u5371\u5730\u9A6C\u62C9\u9AD8\u5730|8|-90.73|14.56|oaxaca leon-nicaragua
leon-nicaragua|\u83B1\u6602|\u5C3C\u52A0\u62C9\u74DC\u4F4E\u5730|8|-86.88|12.44|guatemala cartago
cartago|\u5361\u5854\u6208|\u54E5\u65AF\u8FBE\u9ECE\u52A0\u9AD8\u5730|8|-83.92|9.86|panama
santa-fe|\u5723\u83F2|\u5317\u7F8E\u897F\u5357\u90E8\u9AD8\u539F|9|-105.94|35.69|mexico-city
philadelphia|\u8D39\u57CE|\u7279\u62C9\u534E\u6CB3|9|-75.16|39.95|new-amsterdam williamsburg
williamsburg|\u5A01\u5EC9\u65AF\u5821|\u5F17\u5409\u5C3C\u4E9A|9|-76.71|37.27|philadelphia
montreal|\u8499\u7279\u5229\u5C14|\u5723\u52B3\u4F26\u65AF\u6CB3|9|-73.57|45.50|quebec albany
albany|\u5965\u5C14\u5DF4\u5C3C|\u54C8\u5FB7\u900A\u6CB3\u4E0A\u6E38|9|-73.76|42.65|new-amsterdam montreal
antananarivo|\u5854\u90A3\u90A3\u5229\u4F5B|\u9A6C\u8FBE\u52A0\u65AF\u52A0\u9AD8\u5730|9|47.51|-18.88|toamasina
detroit|\u5E95\u7279\u5F8B|\u5317\u7F8E\u4E94\u5927\u6E56|10|-83.05|42.33|montreal
`.trim();
var additionalInlandCities = records.split("\n").map((line) => {
  const [id, name, region, era, lon, lat, connections] = line.split("|");
  return {
    id: id.replaceAll(" ", ""),
    name,
    region,
    era: Number(era),
    lon: Number(lon),
    lat: Number(lat),
    connections: connections.split(" ")
  };
});
var additionalRoadWaypoints = {
  "merida:veracruz": [
    [-90.5, 19.1],
    [-91.7, 18.4],
    [-94.3, 18]
  ],
  "dengzhou:jinan": [
    [120.4, 37.3],
    [119.3, 36.7]
  ],
  "hanoi:hue": [
    [105.8, 19.2],
    [106.3, 18],
    [107, 16.8]
  ],
  "kairouan:tripoli": [
    [10.1, 34],
    [10.5, 32.7],
    [12, 32.3]
  ],
  "cartago:panama": [
    [-83.2, 9],
    [-82.7, 8.7],
    [-81.4, 8.6],
    [-80.4, 8.5]
  ],
  "detroit:montreal": [
    [-81.3, 42.9],
    [-79.8, 43.5],
    [-77.2, 44.3],
    [-75.8, 45]
  ],
  "edo:nagoya": [
    [138.9, 35.3],
    [138.4, 35],
    [137.7, 34.9]
  ],
  "guangzhou:guilin": [
    [112, 23.9],
    [111, 24.6]
  ],
  "kashgar:samarkand": [
    [73.4, 39.6],
    [71.4, 40.5],
    [69.7, 40.3]
  ],
  "mbanza-kongo:bonny": [
    [12.5, -4],
    [11.4, -0.8],
    [10.7, 2.4],
    [9.5, 4.2]
  ],
  "bonny:mbanza-kongo": [
    [9.5, 4.2],
    [10.7, 2.4],
    [11.4, -0.8],
    [12.5, -4]
  ],
  "asuncion:buenos-aires": [
    [-58.6, -27.5],
    [-58.5, -30.5],
    [-58.5, -32.8]
  ],
  "hanoi:hoi-an": [
    [105.8, 19.2],
    [106.3, 18],
    [107, 16.8]
  ],
  "hoi-an:saigon": [
    [108.5, 14.8],
    [108.9, 12],
    [107.8, 11]
  ],
  "lhasa:chengdu": [
    [93.4, 29.7],
    [96.3, 30.1],
    [98.6, 30.9],
    [101.3, 30]
  ],
  "chengdu:lhasa": [
    [101.3, 30],
    [98.6, 30.9],
    [96.3, 30.1],
    [93.4, 29.7]
  ]
};

// src/dominion.ts
var rows4 = [
  ["thebes", "\u5E95\u6BD4\u65AF", "\u5C3C\u7F57\u6CB3\u8C37", 0, 32.65, 25.7, "memphis"],
  ["babylon", "\u5DF4\u6BD4\u4F26", "\u4E24\u6CB3\u5E73\u539F", 1, 44.42, 32.54, "ur"],
  ["nineveh", "\u5C3C\u5C3C\u5FAE", "\u5E95\u683C\u91CC\u65AF\u6CB3\u4E0A\u6E38", 1, 43.15, 36.36, "babylon"],
  ["damascus", "\u5927\u9A6C\u58EB\u9769", "\u9ECE\u51E1\u7279\u5185\u9646", 0, 36.29, 33.51, "byblos tyre"],
  ["aleppo", "\u963F\u52D2\u9887", "\u53D9\u5229\u4E9A\u5317\u90E8", 1, 37.16, 36.2, "ugarit damascus"],
  ["hattusa", "\u54C8\u56FE\u6C99", "\u5B89\u7EB3\u6258\u5229\u4E9A\u9AD8\u539F", 1, 34.62, 40.02, "sinope"],
  ["persepolis", "\u6CE2\u65AF\u6CE2\u5229\u65AF", "\u4F0A\u6717\u9AD8\u539F", 3, 52.89, 29.94, "siraf"],
  ["susa", "\u82CF\u8428", "\u80E1\u9F50\u65AF\u5766\u5E73\u539F", 0, 48.26, 32.19, "ur basra"],
  ["ecbatana", "\u57C3\u514B\u5DF4\u5766\u90A3", "\u624E\u683C\u7F57\u65AF\u5C71\u5730", 3, 48.51, 34.8, "susa persepolis"],
  ["mohenjo-daro", "\u6469\u4EA8\u4F50\u8FBE\u7F57", "\u5370\u5EA6\u6CB3\u5E73\u539F", 0, 68.14, 27.33, "lothal"],
  ["ujjain", "\u4E4C\u9607\u884D\u90A3", "\u5370\u5EA6\u4E2D\u90E8", 3, 75.78, 23.18, "lothal bharuch"],
  ["pataliputra", "\u534E\u6C0F\u57CE", "\u6052\u6CB3\u4E2D\u6E38", 3, 85.14, 25.61, "satgaon ujjain"],
  ["delhi", "\u5FB7\u91CC", "\u5370\u5EA6\u5317\u90E8", 6, 77.21, 28.61, "ujjain pataliputra"],
  ["madurai", "\u9A6C\u675C\u8D56", "\u6CF0\u7C73\u5C14\u5185\u9646", 3, 78.12, 9.92, "nagapattinam quilon"],
  ["changan", "\u957F\u5B89", "\u5173\u4E2D\u5E73\u539F", 3, 108.94, 34.34, "luoyang"],
  ["luoyang", "\u6D1B\u9633", "\u4E2D\u539F", 3, 112.45, 34.62, "yangzhou"],
  ["chengdu", "\u6210\u90FD", "\u56DB\u5DDD\u76C6\u5730", 3, 104.07, 30.67, "changan"],
  ["jingdezhen", "\u666F\u5FB7\u9547", "\u8D63\u4E1C\u5317", 6, 117.18, 29.27, "hangzhou fuzhou"],
  ["kyoto", "\u4EAC\u90FD", "\u65E5\u672C\u5C71\u57CE\u76C6\u5730", 6, 135.77, 35.01, "sakai"],
  ["gyeongju", "\u5E86\u5DDE", "\u671D\u9C9C\u534A\u5C9B\u4E1C\u5357\u90E8", 5, 129.22, 35.86, "busan"],
  ["rome", "\u7F57\u9A6C", "\u610F\u5927\u5229\u4E2D\u90E8", 3, 12.5, 41.9, "ostia naples"],
  ["florence", "\u4F5B\u7F57\u4F26\u8428", "\u6258\u65AF\u5361\u7EB3", 6, 11.25, 43.77, "pisa rome"],
  ["milan", "\u7C73\u5170", "\u6CE2\u6CB3\u5E73\u539F", 4, 9.19, 45.46, "genoa venice"],
  ["paris", "\u5DF4\u9ECE", "\u585E\u7EB3\u6CB3\u76C6\u5730", 3, 2.35, 48.86, "nantes bordeaux lyon"],
  ["lyon", "\u91CC\u6602", "\u7F57\u8BB7\u6CB3\u8C37", 3, 4.84, 45.76, "marseille"],
  ["cordoba", "\u79D1\u5C14\u591A\u74E6", "\u5B89\u8FBE\u5362\u897F\u4E9A", 4, -4.78, 37.89, "malaga seville"],
  ["fez", "\u975E\u65AF", "\u6469\u6D1B\u54E5\u5185\u9646", 6, -5, 34.04, "tangier"],
  ["cusco", "\u5E93\u65AF\u79D1", "\u5B89\u7B2C\u65AF\u9AD8\u5730", 7, -71.97, -13.52, "callao"],
  [
    "mexico-city",
    "\u58A8\u897F\u54E5\u57CE",
    "\u58A8\u897F\u54E5\u9AD8\u539F",
    8,
    -99.13,
    19.43,
    "veracruz acapulco"
  ],
  ["samarkand", "\u6492\u9A6C\u5C14\u7F55", "\u4E2D\u4E9A\u6CB3\u4E2D\u5730\u533A", 3, 66.97, 39.65, "ecbatana"],
  ["bukhara", "\u5E03\u54C8\u62C9", "\u4E2D\u4E9A\u7EFF\u6D32", 5, 64.42, 39.77, "samarkand"],
  ["nizwa", "\u5C3C\u5179\u74E6", "\u963F\u66FC\u5185\u9646\u7EFF\u6D32", 0, 57.53, 22.93, "magAN muscat sohar"]
];
var inlandCities = [...rows4.map(
  ([id, name, region, era, lon, lat, connections]) => ({
    id,
    name,
    region,
    era,
    lon,
    lat,
    connections: connections.split(" ")
  })
), ...additionalInlandCities];
for (const [id, additions] of Object.entries({ pataliputra: ["calcutta", "dhaka"], paris: ["le-havre"] })) {
  const city = inlandCities.find((c) => c.id === id);
  if (city) city.connections.push(...additions);
}
var inlandById = new Map(inlandCities.map((city) => [city.id, city]));
var baseCities = [
  ...ports.map((p) => ({
    id: p.id,
    name: p.name,
    region: p.region,
    era: p.era,
    lon: p.x * 180,
    lat: p.y * 90,
    coastal: true,
    basin: p.basin
  })),
  ...inlandCities.map((p) => ({ ...p, coastal: false, basin: "land" }))
];
var cityById = new Map(baseCities.map((city) => [city.id, city]));
var waypoints = {
  ...additionalRoadWaypoints,
  "lothal:mohenjo-daro": [
    [72.25, 23.1],
    [70.5, 23.8],
    [68.7, 25.5]
  ],
  "ecbatana:samarkand": [
    [52.6, 35.6],
    [57.5, 36.3],
    [61.9, 37.6],
    [65.6, 38.8]
  ],
  "callao:cusco": [
    [-75.7, -13.1],
    [-73.5, -13.7]
  ],
  "changan:chengdu": [
    [107.8, 33.1],
    [105.9, 32.4]
  ]
};
function kilometers(a, b) {
  const radians = Math.PI / 180, dy = (b.lat - a.lat) * radians, dx = (b.lon - a.lon) * radians;
  const h = Math.sin(dy / 2) ** 2 + Math.cos(a.lat * radians) * Math.cos(b.lat * radians) * Math.sin(dx / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
var inlandRoads = [];
for (const city of inlandCities)
  for (const otherId of city.connections) {
    const other = cityById.get(otherId);
    if (!other) throw new Error(`\u9646\u8DEF\u7AEF\u70B9\u7F3A\u5931\uFF1A${otherId}`);
    const [a, b] = [city.id, otherId].sort(), id = `${a}:${b}`;
    if (inlandRoads.some((road) => road.id === id)) continue;
    const first = cityById.get(a), last = cityById.get(b);
    const path = [
      { lon: first.lon, lat: first.lat },
      ...(waypoints[id] ?? []).map(([lon, lat]) => ({ lon, lat })),
      { lon: last.lon, lat: last.lat }
    ];
    inlandRoads.push({
      id,
      a,
      b,
      waypoints: path,
      km: Math.round(
        path.slice(1).reduce((sum, p, i) => sum + kilometers(path[i], p), 0)
      )
    });
  }
var roadById = new Map(inlandRoads.map((road) => [road.id, road]));
var action = (ok, message) => ({ ok, message });
function hash3(value) {
  let n = 2166136261;
  for (let i = 0; i < value.length; i++) {
    n ^= value.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
}
var cityPrice = (city) => (city.coastal ? 1800 : 1250) + city.era * 1400 + hash3(city.id) % 650;
var cityDefense = (city) => 14 + city.era * 3 + hash3(city.id) % 14;
var connected = (a, b) => inlandRoads.some(
  (road) => road.a === a && road.b === b || road.a === b && road.b === a
);
function createDominionState() {
  return {
    version: 1,
    owned: {},
    discovered: [],
    activeCaravans: [],
    troops: 0,
    armyBaseId: null,
    campaign: null,
    campaignSerial: 0,
    caravanSerial: 0,
    lastProcessedDay: -1
  };
}
var Dominion = class {
  constructor(state, host) {
    this.state = state;
    this.host = host;
  }
  state;
  host;
  known(city) {
    return city.era <= this.host.eraIndex && (city.coastal ? this.host.visited.includes(city.id) : this.state.discovered.includes(city.id));
  }
  netIncome(city, owned) {
    const gross = 10 + city.era * 2 + owned.commerce * 10;
    const shortage = Math.max(0, Math.max(1, owned.commerce) - owned.food) * 6;
    return Math.floor(gross * owned.loyalty / 100) - 3 - owned.defense * 2 - shortage;
  }
  cities() {
    return baseCities.filter((city) => city.era <= this.host.eraIndex).map((city) => {
      const owned = this.state.owned[city.id];
      return {
        id: city.id,
        name: city.name,
        region: city.region,
        era: city.era,
        coastal: city.coastal,
        known: this.known(city),
        owned: !!owned,
        price: cityPrice(city),
        commerce: owned?.commerce ?? 0,
        food: owned?.food ?? 0,
        defense: owned ? cityDefense(city) + owned.defense * 12 : cityDefense(city),
        income: owned ? this.netIncome(city, owned) : 0,
        loyalty: owned?.loyalty ?? 0
      };
    });
  }
  purchase(id) {
    const city = cityById.get(id);
    if (!city || city.era > this.host.eraIndex || !this.known(city))
      return action(false, "\u5148\u63A2\u7D22\u5E76\u53D1\u73B0\u8FD9\u5EA7\u57CE\u5E02\u3002");
    if (this.state.owned[id])
      return action(false, "\u5DF2\u7ECF\u6301\u6709\u8FD9\u5EA7\u57CE\u5E02\u7684\u7ECF\u8425\u7279\u8BB8\u6743\u3002");
    if (this.state.campaign?.targetId === id)
      return action(false, "\u8BE5\u57CE\u6B63\u5728\u4EA4\u6218\uFF0C\u6682\u4E0D\u80FD\u7B7E\u8BA2\u7279\u8BB8\u534F\u8BAE\u3002");
    if (city.coastal && (this.host.atSea || this.host.currentPortId !== id))
      return action(false, "\u8D2D\u4E70\u6CBF\u6D77\u57CE\u5E02\u987B\u4EB2\u81EA\u505C\u9760\uFF0C\u4E0E\u5F53\u5730\u8BAE\u4E8B\u4F1A\u7B7E\u7EA6\u3002");
    if (!city.coastal && !Object.keys(this.state.owned).some((owned) => connected(owned, id)))
      return action(false, "\u5148\u62E5\u6709\u4E00\u5EA7\u4E0E\u5B83\u6709\u9646\u8DEF\u76F8\u8FDE\u7684\u57CE\u5E02\u3002");
    const price = cityPrice(city);
    if (!this.host.spendCash(price))
      return action(false, `\u7B7E\u8BA2\u7279\u8BB8\u534F\u8BAE\u9700\u8981 ${price} \u91D1\u5E01\u3002`);
    this.state.owned[id] = {
      commerce: 0,
      food: 1,
      defense: 0,
      loyalty: 85,
      acquiredDay: this.host.day,
      method: "charter"
    };
    this.host.addReputation(2);
    return action(
      true,
      `\u53D6\u5F97${city.name}\u7ECF\u8425\u7279\u8BB8\u6743\uFF0C\u6BCF\u65E5\u83B7\u5F97\u57CE\u5E02\u51C0\u6536\u5165\uFF0C\u53EF\u7EC4\u7EC7\u9646\u5730\u5546\u961F\u3002`
    );
  }
  develop(id, kind) {
    const city = cityById.get(id), owned = this.state.owned[id];
    if (!city || !owned || !["commerce", "food", "defense"].includes(kind))
      return action(false, "\u53EA\u80FD\u5EFA\u8BBE\u81EA\u5DF1\u62E5\u6709\u7684\u57CE\u5E02\u3002");
    if (owned[kind] >= 3) return action(false, "\u8BE5\u9879\u5EFA\u8BBE\u5DF2\u8FBE\u5230 3 \u7EA7\u3002");
    const cost = (350 + city.era * 140) * (owned[kind] + 1);
    if (!this.host.spendCash(cost))
      return action(false, `\u5EFA\u8BBE\u9700\u8981 ${cost} \u91D1\u5E01\u3002`);
    owned[kind]++;
    return action(
      true,
      `${city.name}${{ commerce: "\u5E02\u573A", food: "\u519C\u7530", defense: "\u57CE\u9632" }[kind]}\u5347\u81F3 ${owned[kind]} \u7EA7\u3002`
    );
  }
  routes() {
    const result = [];
    for (const road of inlandRoads) {
      const fromId = this.state.owned[road.a] ? road.a : this.state.owned[road.b] ? road.b : null;
      if (!fromId) continue;
      const toId = fromId === road.a ? road.b : road.a, from = cityById.get(fromId), to = cityById.get(toId);
      if (Math.max(from.era, to.era) > this.host.eraIndex) continue;
      const days = Math.max(3, Math.ceil(road.km / 100) + 2), cost = 100 + days * 18 + Math.max(from.era, to.era) * 40;
      const commerce = this.state.owned[fromId].commerce;
      result.push({
        id: road.id,
        fromId,
        toId,
        name: `${from.name} \u2192 ${to.name}`,
        days,
        cost,
        reward: Math.round(cost * (1.18 + commerce * 0.035) + days * 4),
        discovered: this.known(to)
      });
    }
    return result;
  }
  sendCaravan(routeId) {
    const route = this.routes().find((road) => road.id === routeId);
    if (!route)
      return action(false, "\u5148\u53D6\u5F97\u9646\u8DEF\u8D77\u70B9\u57CE\u5E02\u7684\u7279\u8BB8\u6743\uFF0C\u5E76\u89E3\u9501\u76F8\u5E94\u65F6\u4EE3\u3002");
    if (this.state.activeCaravans.length >= 3)
      return action(false, "\u6700\u591A\u540C\u65F6\u6D3E\u51FA 3 \u652F\u9646\u5730\u5546\u961F\u3002");
    if (this.state.activeCaravans.some((caravan) => caravan.routeId === routeId))
      return action(false, "\u8FD9\u6761\u9053\u8DEF\u5DF2\u6709\u5546\u961F\u5728\u9014\u3002");
    if (!this.host.spendCash(route.cost))
      return action(
        false,
        `\u5546\u961F\u9700 ${route.cost} \u91D1\u5E01\uFF0C\u5DF2\u5305\u62EC\u8D27\u7269\u3001\u7CAE\u98DF\u548C\u62A4\u9001\u8D39\u7528\u3002`
      );
    const id = `caravan-${++this.state.caravanSerial}`;
    this.state.activeCaravans.push({
      id,
      routeId,
      fromId: route.fromId,
      toId: route.toId,
      sentDay: this.host.day,
      returnsDay: this.host.day + route.days,
      reward: route.reward
    });
    return action(
      true,
      `\u5546\u961F\u542F\u7A0B\uFF1A${route.name}\u3002${route.days} \u65E5\u540E\u56DE\u62A5\uFF0C\u51C6\u5907\u8D39\u542B\u8D27\u7269\u4E0E\u8865\u7ED9\uFF0C\u4E0D\u5360\u8239\u8231\u3002`
    );
  }
  upkeep() {
    const food = Object.values(this.state.owned).reduce(
      (sum, city) => sum + city.food * 2,
      0
    );
    return Math.max(0, Math.ceil(this.state.troops * 1.2) - food);
  }
  recruit(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 100)
      return action(false, "\u62DB\u52DF\u4EBA\u6570\u987B\u4E3A 1 \u81F3 100 \u7684\u6574\u6570\u3002");
    if (this.host.atSea || !this.state.owned[this.host.currentPortId] || !portById.has(this.host.currentPortId))
      return action(false, "\u5728\u62E5\u6709\u7279\u8BB8\u6743\u7684\u6CBF\u6D77\u57CE\u5E02\u505C\u9760\u540E\u624D\u80FD\u62DB\u52DF\u3002");
    if (this.state.campaign)
      return action(false, "\u519B\u961F\u8FDC\u5F81\u4E2D\uFF0C\u5F85\u6218\u5F79\u7ED3\u675F\u518D\u62DB\u52DF\u3002");
    if (this.state.troops && this.state.armyBaseId !== this.host.currentPortId)
      return action(
        false,
        `\u519B\u961F\u9A7B\u624E\u5728${cityById.get(this.state.armyBaseId)?.name ?? "\u539F\u9A7B\u5730"}\uFF0C\u8BF7\u5230\u9A7B\u5730\u8865\u5145\u5175\u5458\u3002`
      );
    if (this.state.troops + quantity > 100)
      return action(false, "\u519B\u961F\u4E0A\u9650\u4E3A 100 \u4EBA\u3002");
    const cost = quantity * 60;
    if (!this.host.spendCash(cost))
      return action(false, `\u62DB\u52DF\u9700\u8981 ${cost} \u91D1\u5E01\uFF0C\u53E6\u6709\u6BCF\u65E5\u519B\u9977\u3002`);
    this.state.troops += quantity;
    this.state.armyBaseId = this.host.currentPortId;
    return action(
      true,
      `\u62DB\u52DF ${quantity} \u4EBA\uFF1B\u73B0\u6709 ${this.state.troops} \u4EBA\uFF0C\u6BCF\u65E5\u519B\u9977 ${this.upkeep()} \u91D1\u5E01\u3002`
    );
  }
  campaignTargets() {
    if (!this.state.troops || this.state.campaign || !this.state.armyBaseId)
      return [];
    const base = cityById.get(this.state.armyBaseId);
    const accessible = /* @__PURE__ */ new Set([base.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const road of inlandRoads) {
        if (accessible.has(road.a) && this.state.owned[road.b] && !accessible.has(road.b)) {
          accessible.add(road.b);
          changed = true;
        }
        if (accessible.has(road.b) && this.state.owned[road.a] && !accessible.has(road.a)) {
          accessible.add(road.a);
          changed = true;
        }
      }
    }
    return baseCities.filter((city) => {
      if (this.state.owned[city.id] || !this.known(city)) return false;
      const landAccess = [...accessible].some((id) => connected(id, city.id));
      const seaAccess = base.coastal && city.coastal && base.basin === city.basin && kilometers(base, city) <= 2200;
      return landAccess || seaAccess;
    }).map((city) => {
      const days = Math.max(3, Math.ceil(kilometers(base, city) / 120) + 2), defense = cityDefense(city);
      const ratio = this.state.troops / defense;
      const winChance = Math.max(0.025, Math.min(0.95, (ratio - 0.2) / 2.1));
      return {
        id: city.id,
        name: city.name,
        days,
        defense,
        winChance,
        cost: 180 + this.state.troops * 8 + days * Math.ceil(this.state.troops * 0.4)
      };
    });
  }
  disband(quantity) {
    if (this.state.campaign)
      return action(false, "\u6218\u5F79\u671F\u95F4\u4E0D\u80FD\u9063\u6563\u8FDC\u5F81\u519B\uFF0C\u8BF7\u7B49\u5F85\u90E8\u961F\u5F52\u6765\u3002");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > this.state.troops)
      return action(false, "\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC7\u73B0\u6709\u5175\u529B\u7684\u9063\u6563\u4EBA\u6570\u3002");
    this.state.troops -= quantity;
    if (!this.state.troops) this.state.armyBaseId = null;
    return action(
      true,
      `${quantity} \u540D\u58EB\u5175\u89E3\u7532\u5F52\u4E61\uFF0C\u6BCF\u65E5\u519B\u9977\u964D\u81F3 ${this.upkeep()} \u91D1\u5E01\u3002\u62DB\u52DF\u8D39\u7528\u4E0D\u9000\u8FD8\u3002`
    );
  }
  attack(id) {
    if (this.state.campaign) return action(false, "\u540C\u4E00\u65F6\u95F4\u53EA\u80FD\u8FDB\u884C\u4E00\u573A\u6218\u5F79\u3002");
    const target = this.campaignTargets().find((city) => city.id === id);
    if (!target)
      return action(
        false,
        "\u76EE\u6807\u987B\u5DF2\u53D1\u73B0\u3001\u4E0E\u5DF1\u65B9\u9646\u8DEF\u76F8\u8FDE\uFF0C\u6216\u5728\u9A7B\u519B\u6E2F\u53E3\u9644\u8FD1\u540C\u4E00\u6D77\u57DF\u3002"
      );
    if (!this.host.spendCash(target.cost))
      return action(false, `\u8FDC\u5F81\u9700 ${target.cost} \u91D1\u5E01\uFF0C\u53E6\u8BA1\u6BCF\u65E5\u519B\u9977\u3002`);
    const serial = ++this.state.campaignSerial;
    this.state.campaign = {
      targetId: id,
      fromId: this.state.armyBaseId,
      sentDay: this.host.day,
      arrivesDay: this.host.day + target.days,
      force: this.state.troops,
      winChance: target.winChance,
      roll: hash3(`${id}:${this.host.day}:${serial}:${this.state.troops}`) / 4294967296,
      serial
    };
    this.host.addReputation(-5);
    return action(
      true,
      `\u519B\u961F\u524D\u5F80${target.name}\uFF0C${target.days} \u65E5\u540E\u7ED3\u7B97\u3002\u9884\u4F30\u80DC\u7387 ${Math.round(target.winChance * 100)}%\uFF0C\u8FDC\u5F81\u4F1A\u5F71\u54CD\u5546\u8D38\u58F0\u671B\u3002`
    );
  }
  army() {
    return {
      troops: this.state.troops,
      upkeep: this.upkeep(),
      campaign: this.state.campaign ? {
        targetId: this.state.campaign.targetId,
        arrivesDay: this.state.campaign.arrivesDay
      } : null
    };
  }
  caravans() {
    return this.state.activeCaravans.map((caravan) => ({
      id: caravan.id,
      name: `${cityById.get(caravan.fromId).name} \u2192 ${cityById.get(caravan.toId).name}`,
      returnsDay: caravan.returnsDay,
      reward: caravan.reward
    }));
  }
  daily() {
    const messages = [], day = this.host.day;
    if (day <= this.state.lastProcessedDay) return { messages };
    this.state.lastProcessedDay = day;
    let income = 0;
    for (const [id, owned] of Object.entries(this.state.owned)) {
      if (owned.acquiredDay >= day) continue;
      owned.loyalty = Math.min(
        100,
        owned.loyalty + (owned.food >= Math.max(1, owned.commerce) ? 1 : 0)
      );
      income += this.netIncome(cityById.get(id), owned);
    }
    if (income > 0) this.host.addCash(income);
    if (income < 0 && !this.host.spendCash(-income)) {
      for (const owned of Object.values(this.state.owned))
        owned.loyalty = Math.max(10, owned.loyalty - 1);
      messages.push(
        "\u57CE\u5E02\u6536\u652F\u51FA\u73B0\u7F3A\u53E3\uFF0C\u62E8\u6B3E\u4E0D\u8DB3\u5F71\u54CD\u5FE0\u8BDA\u5EA6\uFF1B\u4F18\u5148\u5EFA\u8BBE\u7CAE\u98DF\u3001\u51CF\u5C11\u8FC7\u5EA6\u57CE\u9632\u5F00\u652F\u3002"
      );
    }
    const upkeep = this.upkeep();
    if (upkeep && !this.host.spendCash(upkeep)) {
      const lost = Math.max(1, Math.ceil(this.state.troops * 0.12));
      this.state.troops = Math.max(0, this.state.troops - lost);
      if (!this.state.troops) this.state.armyBaseId = null;
      messages.push(
        `\u519B\u9977\u4E0D\u8DB3\uFF0C${lost} \u540D\u58EB\u5175\u79BB\u961F\u3002\u57CE\u5E02\u7CAE\u98DF\u5EFA\u8BBE\u53EF\u51CF\u8F7B\u519B\u9977\u8D1F\u62C5\u3002`
      );
    }
    const completed = this.state.activeCaravans.filter(
      (caravan) => caravan.returnsDay <= day
    );
    this.state.activeCaravans = this.state.activeCaravans.filter(
      (caravan) => caravan.returnsDay > day
    );
    for (const caravan of completed) {
      const city = cityById.get(caravan.toId);
      if (!city.coastal && !this.state.discovered.includes(city.id))
        this.state.discovered.push(city.id);
      this.host.addCash(caravan.reward);
      this.host.addReputation(1);
      messages.push(
        `\u9646\u5730\u5546\u961F\u5F52\u6765\uFF0C${city.name}\u5546\u8DEF\u5DF2\u63A2\u660E\uFF1B\u6536\u5230 ${caravan.reward} \u91D1\u5E01\u56DE\u6B3E\uFF08\u542B\u672C\u91D1\uFF09\u3002`
      );
    }
    const campaign = this.state.campaign;
    if (campaign && campaign.arrivesDay <= day) {
      this.state.campaign = null;
      const city = cityById.get(campaign.targetId);
      const strength = Math.min(
        1,
        this.state.troops / Math.max(1, campaign.force)
      );
      const victory = this.state.troops > 0 && campaign.roll < campaign.winChance * strength;
      const lossRate = victory ? 0.12 + campaign.roll * 0.13 : 0.35 + campaign.roll * 0.25;
      const losses = Math.min(
        this.state.troops,
        Math.max(1, Math.ceil(this.state.troops * lossRate))
      );
      this.state.troops -= losses;
      if (!this.state.troops) this.state.armyBaseId = null;
      if (victory && !this.state.owned[city.id]) {
        this.state.owned[city.id] = {
          commerce: 0,
          food: 0,
          defense: 0,
          loyalty: 35,
          acquiredDay: day,
          method: "conquest"
        };
        this.host.addReputation(-7);
        messages.push(
          `\u53D6\u5F97${city.name}\u63A7\u5236\u6743\uFF0C\u635F\u5931 ${losses} \u4EBA\u3002\u5F53\u5730\u5FE0\u8BDA\u5EA6\u4EC5 35\uFF0C\u987B\u5EFA\u8BBE\u7CAE\u98DF\u6062\u590D\u6536\u5165\u3002`
        );
      } else
        messages.push(
          `${city.name}\u8FDC\u5F81\u5931\u5229\uFF0C${losses} \u4EBA\u79BB\u961F\uFF1B\u6B8B\u90E8\u5DF2\u8FD4\u56DE\u539F\u9A7B\u5730\u3002\u5148\u79EF\u7D2F\u8D38\u6613\u6536\u5165\u5E76\u8865\u5145\u519B\u529B\u3002`
        );
    }
    return { messages };
  }
};
function readDominionState(raw, day) {
  if (raw === void 0) return createDominionState();
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || !Number.isInteger(day) || day < 0)
    return null;
  const state = raw;
  const integer2 = (value, min, max) => typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
  const record = (value) => !!value && typeof value === "object" && !Array.isArray(value);
  if (state.version !== 1 || !record(state.owned) || Object.keys(state.owned).length > baseCities.length || !Array.isArray(state.discovered) || state.discovered.length > inlandCities.length || new Set(state.discovered).size !== state.discovered.length || state.discovered.some(
    (id) => typeof id !== "string" || !inlandById.has(id)
  ) || !integer2(state.troops, 0, 100) || !integer2(state.campaignSerial, 0, 1e7) || !integer2(state.caravanSerial, 0, 1e7) || !integer2(state.lastProcessedDay, -1, day))
    return null;
  for (const [id, value] of Object.entries(state.owned)) {
    if (!cityById.has(id) || !record(value) || !integer2(value.commerce, 0, 3) || !integer2(value.food, 0, 3) || !integer2(value.defense, 0, 3) || !integer2(value.loyalty, 0, 100) || !integer2(value.acquiredDay, 0, day) || !["charter", "conquest"].includes(value.method))
      return null;
    if (inlandById.has(id) && !state.discovered.includes(id)) return null;
  }
  if (state.armyBaseId !== null && (typeof state.armyBaseId !== "string" || !portById.has(state.armyBaseId) || !state.owned[state.armyBaseId]))
    return null;
  if (state.troops > 0 && state.armyBaseId === null) return null;
  if (!Array.isArray(state.activeCaravans) || state.activeCaravans.length > 3)
    return null;
  const caravanIds = /* @__PURE__ */ new Set(), roadIds = /* @__PURE__ */ new Set();
  for (const caravan of state.activeCaravans) {
    if (!record(caravan) || typeof caravan.id !== "string" || !/^caravan-\d{1,8}$/.test(caravan.id) || Number(caravan.id.slice(8)) < 1 || Number(caravan.id.slice(8)) > state.caravanSerial || caravanIds.has(caravan.id) || typeof caravan.routeId !== "string" || roadIds.has(caravan.routeId))
      return null;
    const road = roadById.get(caravan.routeId);
    if (!road || !state.owned[caravan.fromId] || !(road.a === caravan.fromId && road.b === caravan.toId || road.b === caravan.fromId && road.a === caravan.toId) || !integer2(caravan.sentDay, 0, day) || !integer2(
      caravan.returnsDay,
      caravan.sentDay + 1,
      caravan.sentDay + 100
    ) || !integer2(caravan.reward, 1, 2e4))
      return null;
    const from = cityById.get(caravan.fromId), to = cityById.get(caravan.toId);
    const days = Math.max(3, Math.ceil(road.km / 100) + 2);
    const cost = 100 + days * 18 + Math.max(from.era, to.era) * 40;
    const possibleRewards = [0, 1, 2, 3].map(
      (commerce) => Math.round(cost * (1.18 + commerce * 0.035) + days * 4)
    );
    if (caravan.returnsDay !== caravan.sentDay + days || !possibleRewards.includes(caravan.reward))
      return null;
    caravanIds.add(caravan.id);
    roadIds.add(caravan.routeId);
  }
  if (state.campaign !== null) {
    const campaign = state.campaign;
    if (!record(campaign) || typeof campaign.targetId !== "string" || !cityById.has(campaign.targetId) || state.owned[campaign.targetId] || typeof campaign.fromId !== "string" || !state.owned[campaign.fromId] || !portById.has(campaign.fromId) || !integer2(campaign.sentDay, 0, day) || !integer2(
      campaign.arrivesDay,
      campaign.sentDay + 1,
      campaign.sentDay + 100
    ) || !integer2(campaign.force, 1, 100) || !integer2(campaign.serial, 1, state.campaignSerial) || typeof campaign.winChance !== "number" || !Number.isFinite(campaign.winChance) || campaign.winChance < 0.025 || campaign.winChance > 0.95 || typeof campaign.roll !== "number" || !Number.isFinite(campaign.roll) || campaign.roll < 0 || campaign.roll >= 1)
      return null;
    const target = cityById.get(campaign.targetId), base = cityById.get(campaign.fromId);
    const days = Math.max(3, Math.ceil(kilometers(base, target) / 120) + 2);
    const chance = Math.max(
      0.025,
      Math.min(0.95, (campaign.force / cityDefense(target) - 0.2) / 2.1)
    );
    if (campaign.arrivesDay !== campaign.sentDay + days || campaign.winChance !== chance || campaign.serial !== state.campaignSerial || campaign.force < state.troops || state.troops > 0 && state.armyBaseId !== campaign.fromId || !target.coastal && !state.discovered.includes(target.id))
      return null;
    if (campaign.roll !== hash3(
      `${campaign.targetId}:${campaign.sentDay}:${campaign.serial}:${campaign.force}`
    ) / 4294967296)
      return null;
  }
  return {
    version: 1,
    owned: Object.fromEntries(
      Object.entries(state.owned).map(([id, owned]) => [id, { ...owned }])
    ),
    discovered: [...state.discovered],
    activeCaravans: state.activeCaravans.map((caravan) => ({ ...caravan })),
    troops: state.troops,
    armyBaseId: state.armyBaseId,
    campaign: state.campaign ? { ...state.campaign } : null,
    campaignSerial: state.campaignSerial,
    caravanSerial: state.caravanSerial,
    lastProcessedDay: state.lastProcessedDay
  };
}

// src/sim.ts
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var dict = (items, value = 0) => Object.fromEntries(items.map((id) => [id, value]));
var fresh = () => ({
  version: 2,
  day: 1,
  eraIndex: 0,
  cash: 0,
  reputation: 15,
  currentPortId: ports[0].id,
  destinationId: null,
  ship: {
    name: "\u6CB3\u53E3\u53F7",
    capacity: 30,
    hull: 100,
    maxHull: 100,
    speed: 1,
    level: 1
  },
  cargo: dict(goods.map((g) => g.id)),
  cargoCost: dict(goods.map((g) => g.id)),
  cargoCostEstimated: Object.fromEntries(goods.map((g) => [g.id, false])),
  tradeLedger: {
    sinceDay: 1,
    revenue: 0,
    costBasis: 0,
    realizedTradingProfit: 0,
    costBasisEstimated: false
  },
  lastTrade: null,
  lastVoyage: null,
  marketShift: dict(ports.map((p) => p.id)),
  marketEvents: [],
  stock: Object.fromEntries(
    ports.map((p) => [
      p.id,
      dict(
        goodsForPort(p.id, 10, true).map((g) => g.id),
        100
      )
    ])
  ),
  investments: dict(ports.map((p) => p.id)),
  routeRisk: 0,
  lastEvent: "\u7B49\u5F85\u5BB6\u65CF\u8D77\u822A",
  started: false,
  originId: origins[0].id,
  supplies: 90,
  fleetSize: 1,
  strategy: "avoid",
  voyage: null,
  navigation: createNavigation(ports[0], 1),
  life: createLifeState(),
  dominion: createDominionState(),
  logs: [],
  sandbox: false,
  sandboxUnlocked: false,
  generation: 1,
  visited: [],
  profits: 0
});
var TradeSim = class {
  state = fresh();
  dominion() {
    const sim = this;
    return new Dominion(this.state.dominion, {
      get day() {
        return sim.state.day;
      },
      get eraIndex() {
        return sim.state.eraIndex;
      },
      get currentPortId() {
        return sim.state.currentPortId;
      },
      get cash() {
        return sim.state.cash;
      },
      get atSea() {
        return !!sim.state.voyage;
      },
      get visited() {
        return sim.state.visited;
      },
      spendCash: (amount) => {
        if (!Number.isFinite(amount) || amount < 0 || sim.state.cash < amount)
          return false;
        sim.state.cash -= amount;
        return true;
      },
      addCash: (amount) => {
        if (Number.isFinite(amount) && amount >= 0) sim.state.cash += amount;
      },
      addReputation: (amount) => {
        sim.state.reputation = clamp(sim.state.reputation + amount, 0, 100);
      }
    });
  }
  life(portId = this.state.currentPortId) {
    const sim = this;
    return new PortLife(this.state.life, {
      get day() {
        return sim.state.day;
      },
      get eraIndex() {
        return sim.state.eraIndex;
      },
      get currentPortId() {
        return portId;
      },
      get cash() {
        return sim.state.cash;
      },
      get atSea() {
        return !!sim.state.voyage;
      },
      get supplies() {
        return sim.state.supplies;
      },
      get shipCapacity() {
        return sim.state.ship.capacity;
      },
      cargo: (id) => sim.state.cargo[id] || 0,
      marketGoods: (id) => goodsForPort(id, sim.state.eraIndex, sim.state.sandbox),
      spendCash: (amount) => {
        if (!Number.isFinite(amount) || amount < 0 || sim.state.cash < amount)
          return false;
        sim.state.cash -= amount;
        return true;
      },
      addCash: (amount) => {
        if (Number.isFinite(amount) && amount >= 0) sim.state.cash += amount;
      },
      consumeCargo: (id, qty) => {
        if (!Number.isInteger(qty) || qty < 0 || !goodById.has(id) || sim.state.cargo[id] < qty)
          return false;
        sim.removeCargo(id, qty);
        return true;
      },
      addReputation: (amount) => {
        sim.state.reputation = clamp(sim.state.reputation + amount, 0, 100);
      }
    });
  }
  capacity() {
    return this.state.ship.capacity + this.life().bonuses().capacity;
  }
  random(key) {
    let h = 2166136261;
    for (const c of `${key}:${this.state.day}:${this.state.originId}`)
      h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return (h >>> 0) / 4294967296;
  }
  log(text) {
    this.state.lastEvent = text;
    this.state.logs.push(`\u7B2C ${this.state.day} \u65E5 \xB7 ${text}`);
    if (this.state.logs.length > 100) this.state.logs.shift();
  }
  fail(text) {
    this.state.lastEvent = text;
    return false;
  }
  docked() {
    return this.state.started && !this.state.voyage;
  }
  start(origin) {
    const valid = origins.find((o) => o.id === origin.id);
    if (!valid) return;
    this.state = fresh();
    Object.assign(this.state, {
      started: true,
      cash: valid.capital,
      currentPortId: valid.portId,
      originId: valid.id,
      eraIndex: valid.era,
      visited: [valid.portId]
    });
    Object.assign(this.state.cargo, valid.goods);
    this.state.navigation = createNavigation(this.port(), this.state.day);
    for (const good2 of goods) {
      this.state.cargoCost[good2.id] = this.state.cargo[good2.id] * good2.base;
      this.state.cargoCostEstimated[good2.id] = this.state.cargo[good2.id] > 0;
    }
    this.log(
      `\u5BB6\u65CF\u5728${valid.title}\u5EFA\u7ACB\u5546\u53F7\u3002\u8D77\u59CB\u8D27\u7269\u6309\u5546\u54C1\u6807\u51C6\u53C2\u8003\u4EF7\u5165\u8D26\uFF0C\u51FA\u552E\u5DEE\u989D\u4E0D\u542B\u822A\u884C\u5F00\u652F\u3002`
    );
    this.publishMarketEvent(true);
  }
  publishMarketEvent(local = false) {
    const reportPorts = this.availablePorts().filter(
      (port2) => !local || port2.basin === this.port().basin
    );
    const event = createMarketEvent(
      this.state.day,
      reportPorts,
      this.availableGoods(),
      (key) => this.random(key)
    );
    this.state.marketEvents.push(event);
    this.state.marketEvents = this.state.marketEvents.slice(-32);
    this.log(`\u8FDC\u6E2F\u6765\u4FE1 \xB7 ${event.source}\uFF1A${event.clue}`);
  }
  port(id = this.state.currentPortId) {
    return portById.get(id) ?? ports[0];
  }
  destination(id) {
    return this.port(id);
  }
  availablePorts() {
    return ports.filter(
      (p) => p.era <= this.state.eraIndex || this.state.sandbox
    );
  }
  availableGoods() {
    return goods.filter(
      (g) => g.era <= this.state.eraIndex || this.state.sandbox
    );
  }
  marketGoods(portId = this.state.currentPortId) {
    const local = goodsForPort(portId, this.state.eraIndex, this.state.sandbox);
    const held = goods.filter(
      (g) => (this.state.cargo[g.id] || 0) > 0 && !local.some((x) => x.id === g.id)
    );
    return [...local, ...held];
  }
  marketStock(portId, goodId) {
    return this.state.stock[portId]?.[goodId] ?? 0;
  }
  cargoCount() {
    return Object.values(this.state.cargo).reduce((a, b) => a + b, 0);
  }
  cargoUnitCost(goodId) {
    const quantity = this.state.cargo[goodId] || 0;
    return quantity > 0 ? this.state.cargoCost[goodId] / quantity : 0;
  }
  salePreview(goodId, amount) {
    const quote = this.quote(goodId, amount, "sell");
    const held = this.state.cargo[goodId] || 0;
    const costBasis = held && quote.quantity ? this.state.cargoCost[goodId] * (quote.quantity / held) : 0;
    return {
      quantity: quote.quantity,
      revenue: quote.total,
      costBasis,
      tradingProfit: quote.total - costBasis,
      costBasisEstimated: quote.quantity > 0 && this.state.cargoCostEstimated[goodId]
    };
  }
  voyageExpenseReport() {
    const report = this.state.lastVoyage;
    if (!report) return null;
    const operatingCost = report.wages + report.transfer + report.suppliesCost + report.ransom;
    return {
      ...report,
      operatingCost,
      totalRecordedCost: operatingCost + report.cargoLossCost
    };
  }
  removeCargo(goodId, quantity) {
    const held = this.state.cargo[goodId];
    if (!held || !quantity) return 0;
    const removedCost = this.state.cargoCost[goodId] * (quantity / held);
    this.state.cargo[goodId] -= quantity;
    this.state.cargoCost[goodId] = quantity === held ? 0 : Math.max(0, this.state.cargoCost[goodId] - removedCost);
    if (quantity === held) this.state.cargoCostEstimated[goodId] = false;
    return removedCost;
  }
  tax(portId = this.state.currentPortId) {
    return Math.max(
      0.025,
      0.06 - (this.state.investments[portId] || 0) * 6e-3 - this.state.reputation * 1e-4 - this.life(portId).bonuses().taxReduction
    );
  }
  discount(goodId) {
    const o = this.state.originId;
    const eligible = {
      egypt: [["grain", "linen"], 0.1],
      mesopotamia: [["pottery"], 0.12],
      levant: [["cedar"], 0.12],
      dilmun: [["salt", "copper"], 0.08],
      indus: [["linen", "pottery"], 0.1],
      oman: [["copper"], 0.12]
    };
    const entry = eligible[o];
    return entry && entry[0].includes(goodId) ? entry[1] : 0;
  }
  rawPrice(portId, goodId, stockOverride) {
    const p = portById.get(portId), g = goodById.get(goodId);
    if (!p || !g) return 0;
    const local = p.produces.includes(goodId) ? 0.72 : p.demands.includes(goodId) ? 1.5 : 1.06;
    const stock = stockOverride ?? this.marketStock(portId, goodId);
    const pressure = clamp(1 + (100 - stock) * 4e-3, 0.62, 1.7);
    const seasonal = 1 + (this.random(`${portId}:${goodId}`) - 0.5) * 0.09;
    const eventFactor = marketEventFactor(
      this.state.marketEvents,
      portId,
      goodId,
      this.state.day
    );
    return Math.max(5, g.base * local * pressure * seasonal * eventFactor);
  }
  price(portId, goodId) {
    return Math.round(this.rawPrice(portId, goodId));
  }
  buyPrice(portId, goodId, stockOverride) {
    return Math.max(
      this.sellPrice(portId, goodId, (stockOverride ?? this.marketStock(portId, goodId)) - 1) + 1,
      Math.ceil(
        this.rawPrice(portId, goodId, stockOverride) * 1.05 * (1 - this.discount(goodId)) * (1 - (this.port(portId).produces.includes(goodId) ? this.life(portId).bonuses().production : 0))
      )
    );
  }
  sellPrice(portId, goodId, stockOverride) {
    return Math.max(
      1,
      Math.floor(
        this.rawPrice(portId, goodId, stockOverride) * (0.91 - this.tax(portId))
      )
    );
  }
  quote(goodId, amount, side, portId = this.state.currentPortId) {
    if (!goodById.has(goodId) || !portById.has(portId) || !Number.isFinite(amount))
      return { quantity: 0, total: 0 };
    const inventory = this.marketStock(portId, goodId);
    const freeCapacity = this.capacity() - this.cargoCount();
    let total = 0, quantity = 0;
    const max = Math.max(
      0,
      Math.min(
        1e4,
        Math.floor(amount),
        side === "buy" ? inventory : this.state.cargo[goodId]
      )
    );
    for (let i = 0; i < max; i++) {
      const price = side === "buy" ? this.buyPrice(portId, goodId, inventory - i) : this.sellPrice(portId, goodId, inventory + i);
      if (side === "buy" && (total + price > this.state.cash || quantity >= freeCapacity))
        break;
      total += price;
      quantity++;
    }
    return { quantity, total };
  }
  buy(goodId, amount) {
    if (!this.docked()) return this.fail("\u8BF7\u5148\u505C\u9760\u6E2F\u53E3\u518D\u4EA4\u6613\u3002");
    if (!this.availableGoods().some((g) => g.id === goodId))
      return this.fail("\u8BE5\u8D27\u7269\u5C1A\u672A\u5F00\u653E\u3002");
    const q = this.quote(goodId, amount, "buy");
    if (!q.quantity) return this.fail("\u91D1\u5E01\u3001\u8D27\u8231\u6216\u5E02\u573A\u5E93\u5B58\u4E0D\u8DB3\u3002");
    this.state.cash -= q.total;
    this.state.cargo[goodId] += q.quantity;
    this.state.cargoCost[goodId] += q.total;
    this.state.stock[this.state.currentPortId][goodId] -= q.quantity;
    this.state.lastTrade = {
      day: this.state.day,
      portId: this.state.currentPortId,
      goodId,
      side: "buy",
      quantity: q.quantity,
      total: q.total,
      costBasis: q.total,
      tradingProfit: null,
      costBasisEstimated: false
    };
    this.log(
      `\u8D2D\u5165 ${q.quantity} ${goods.find((g) => g.id === goodId).unit}${goods.find((g) => g.id === goodId).name}\uFF0C\u652F\u4ED8 ${q.total} \u91D1\u5E01\u3002`
    );
    return true;
  }
  sell(goodId, amount) {
    if (!this.docked()) return this.fail("\u8BF7\u5148\u505C\u9760\u6E2F\u53E3\u518D\u4EA4\u6613\u3002");
    if (!this.availableGoods().some((g) => g.id === goodId))
      return this.fail("\u8BE5\u8D27\u7269\u5C1A\u672A\u5F00\u653E\u3002");
    const preview = this.salePreview(goodId, amount);
    const q = { quantity: preview.quantity, total: preview.revenue };
    if (!q.quantity) return this.fail("\u6CA1\u6709\u53EF\u51FA\u552E\u7684\u8D27\u7269\u3002");
    this.state.cash += q.total;
    this.removeCargo(goodId, q.quantity);
    this.state.stock[this.state.currentPortId][goodId] = this.marketStock(this.state.currentPortId, goodId) + q.quantity;
    this.state.reputation = clamp(
      this.state.reputation + q.quantity * 0.04,
      0,
      100
    );
    this.state.profits += q.total;
    this.state.tradeLedger.revenue += q.total;
    this.state.tradeLedger.costBasis += preview.costBasis;
    this.state.tradeLedger.realizedTradingProfit = this.state.tradeLedger.revenue - this.state.tradeLedger.costBasis;
    this.state.tradeLedger.costBasisEstimated ||= preview.costBasisEstimated;
    this.state.lastTrade = {
      day: this.state.day,
      portId: this.state.currentPortId,
      goodId,
      side: "sell",
      quantity: q.quantity,
      total: q.total,
      costBasis: preview.costBasis,
      tradingProfit: preview.tradingProfit,
      costBasisEstimated: preview.costBasisEstimated
    };
    this.log(
      `\u552E\u51FA ${q.quantity} ${goods.find((g) => g.id === goodId).unit}${goods.find((g) => g.id === goodId).name}\uFF0C\u6536\u5165 ${q.total} \u91D1\u5E01\uFF0C\u8D27\u7269\u5DEE\u989D ${preview.tradingProfit >= 0 ? "+" : ""}${preview.tradingProfit.toFixed(1)} \u91D1\u5E01\uFF08\u4E0D\u542B\u822A\u884C\u5F00\u652F${preview.costBasisEstimated ? "\uFF0C\u6210\u672C\u542B\u53C2\u8003\u4F30\u503C" : ""}\uFF09\u3002`
    );
    this.checkCompletion();
    return true;
  }
  assets() {
    return Math.floor(
      this.state.cash + this.dominion().cities().filter(
        (c) => c.owned && this.state.dominion.owned[c.id].method === "charter"
      ).reduce((sum, c) => sum + c.price * 0.45, 0) + goods.reduce(
        (sum, g) => sum + (this.state.cargo[g.id] || 0) * g.base * 0.52,
        0
      ) + this.state.fleetSize * 240 * this.state.ship.level * (this.state.ship.hull / this.state.ship.maxHull) * 0.7 + Object.values(this.state.investments).reduce(
        (sum, n) => sum + n * 400,
        0
      )
    );
  }
  distance(to) {
    const from = this.port();
    const lat1 = from.y * Math.PI / 2, lat2 = to.y * Math.PI / 2, dl = (to.x - from.x) * Math.PI;
    const a = Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dl / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  voyage(destinationId, precise = true) {
    const to = this.port(destinationId), from = this.port();
    const route = precise ? planSeaRoute(
      this.state.voyage ? this.state.navigation.position : portPoint(from),
      to
    ) : [];
    const distance = precise ? this.routeDistance(route) * 111 : this.distance(to);
    const transfer = false;
    const days = Math.max(2, Math.ceil(distance / 111 / this.sailingSpeed()));
    const risk = clamp(
      0.07 + to.danger * 0.45 + distance / 45e3 - this.state.reputation * 5e-4 - (this.state.originId === "oman" ? 0.035 : 0) - (this.state.strategy === "avoid" ? 0.06 : 0) - this.life().bonuses().riskReduction,
      0.025,
      0.6
    );
    const supplies = Math.ceil(
      days * this.state.fleetSize * 2 * (1 - this.life().bonuses().supplyReduction)
    ), wages = days * this.state.fleetSize * 2;
    return {
      days,
      risk,
      supplies,
      wages,
      cost: wages + supplies * 2 + (transfer ? 12 : 0),
      transfer,
      reachable: !precise || route.length > 1
    };
  }
  routeScore(destinationId) {
    const v = this.voyage(destinationId);
    let best = { id: "grain", profit: 0, quantity: 0 };
    for (const g of goodsForPort(
      this.state.currentPortId,
      this.state.eraIndex,
      this.state.sandbox
    )) {
      const q = this.quote(
        g.id,
        Math.min(30, this.capacity() - this.cargoCount()),
        "buy"
      );
      const revenue = Array.from(
        { length: q.quantity },
        (_, i) => this.sellPrice(
          destinationId,
          g.id,
          this.marketStock(destinationId, g.id) + i
        )
      ).reduce((a, b) => a + b, 0);
      const profit2 = revenue - q.total;
      if (profit2 > best.profit)
        best = { id: g.id, profit: profit2, quantity: q.quantity };
    }
    const held = goods.filter((g) => this.state.cargo[g.id] > 0).reduce(
      (n, g) => n + this.state.cargo[g.id] * (this.sellPrice(destinationId, g.id) - this.sellPrice(this.state.currentPortId, g.id)),
      0
    );
    const expectedLoss = Math.round(
      (this.cargoCount() + best.quantity) * 7 * v.risk
    ), profit = Math.round(best.profit + held - v.cost - expectedLoss);
    const name = goods.find((g) => g.id === best.id).name;
    return {
      profit,
      days: v.days,
      risk: v.risk,
      grade: v.risk < 0.13 ? "\u7A33\u5065" : v.risk < 0.24 ? "\u5E73\u8861" : "\u8C28\u614E",
      goodId: best.id,
      quantity: best.quantity,
      expectedLoss,
      cost: v.cost,
      reason: `${best.quantity ? `\u53EF\u8D2D\u5165 ${best.quantity} \u5355\u4F4D${name}\uFF0C` : "\u4F18\u5148\u8FD0\u9001\u73B0\u6709\u8D27\u7269\uFF0C"}\u4F30\u7B97\u5DF2\u6263\u9664 ${v.cost} \u91D1\u5E01\u822A\u884C\u6210\u672C\u4E0E ${expectedLoss} \u91D1\u5E01\u98CE\u9669\u51C6\u5907\u3002${v.transfer ? "\u8DE8\u6D77\u57DF\u5305\u542B\u5546\u6808\u8F6C\u8FD0\u4E0E\u7ED5\u822A\u6BB5\u3002" : ""}\u62B5\u6E2F\u62A5\u4EF7\u4F1A\u968F\u5E02\u573A\u53D8\u5316\u3002`
    };
  }
  sail(destinationId) {
    if (!this.docked()) return this.fail("\u8239\u961F\u6B63\u5728\u822A\u884C\u3002");
    if (!this.availablePorts().some((p) => p.id === destinationId) || destinationId === this.state.currentPortId)
      return this.fail("\u8BF7\u9009\u62E9\u4E00\u4E2A\u53EF\u7528\u7684\u76EE\u7684\u6E2F\u3002");
    if (this.state.ship.hull < this.state.ship.maxHull * 0.2)
      return this.fail("\u8239\u4F53\u53D7\u635F\u4E25\u91CD\uFF0C\u8BF7\u5148\u7EF4\u4FEE\u3002");
    const v = this.voyage(destinationId, true);
    if (!v.reachable)
      return this.fail("\u6682\u672A\u627E\u5230\u53EF\u901A\u822A\u6D77\u8DEF\uFF0C\u8BF7\u9009\u62E9\u90BB\u8FD1\u6E2F\u53E3\u6216\u7B49\u5F85\u5730\u56FE\u52A0\u8F7D\u3002");
    if (this.state.supplies < v.supplies)
      return this.fail(`\u672C\u822A\u7A0B\u9700\u8981 ${v.supplies} \u4EFD\u8865\u7ED9\uFF0C\u8BF7\u5148\u5728\u8239\u961F\u9762\u677F\u8865\u6EE1\u3002`);
    const prepaid = v.wages + (v.transfer ? 12 : 0);
    if (this.state.cash < prepaid)
      return this.fail(
        `\u9700\u8981\u9884\u4ED8 ${prepaid} \u91D1\u5E01${v.transfer ? "\u8239\u5458\u5DE5\u8D44\u4E0E\u8F6C\u8FD0\u8D39" : "\u8239\u5458\u5DE5\u8D44"}\u3002`
      );
    this.state.cash -= prepaid;
    this.state.navigation.position = portPoint(this.port());
    this.state.navigation.route = planSeaRoute(
      this.state.navigation.position,
      this.port(destinationId)
    );
    this.state.navigation.leg = 1;
    this.state.navigation.manual = false;
    this.state.navigation.throttle = 1;
    this.state.navigation.targetId = destinationId;
    this.state.destinationId = destinationId;
    this.state.routeRisk = v.risk;
    this.state.voyage = {
      pace: this.routeDistance(this.state.navigation.route) / v.days,
      fromId: this.state.currentPortId,
      toId: destinationId,
      totalDays: v.days,
      elapsedDays: 0,
      risk: v.risk,
      strategy: this.state.strategy,
      dailySupply: this.state.fleetSize * 2 * (1 - this.life().bonuses().supplyReduction),
      wages: v.wages
    };
    this.state.lastVoyage = {
      fromId: this.state.currentPortId,
      toId: destinationId,
      startedDay: this.state.day,
      endedDay: null,
      wages: v.wages,
      transfer: v.transfer ? 12 : 0,
      suppliesUsed: 0,
      suppliesCost: 0,
      ransom: 0,
      cargoLossQuantity: 0,
      cargoLossCost: 0,
      costBasisEstimated: false,
      partial: false
    };
    this.log(
      `\u8239\u961F\u9A76\u5411${this.port(destinationId).name}\uFF0C\u9884\u8BA1 ${v.days} \u65E5\u62B5\u8FBE\uFF0C\u9884\u4ED8\u5DE5\u8D44 ${v.wages} \u91D1\u5E01${v.transfer ? "\uFF0C\u8F6C\u8FD0\u8D39 12 \u91D1\u5E01" : ""}\u3002`
    );
    return true;
  }
  loseCargo(amount) {
    let left = Math.min(this.cargoCount(), Math.max(0, Math.floor(amount))), lost = 0;
    for (const g of goods) {
      const n = Math.min(this.state.cargo[g.id], left);
      const estimated = this.state.cargoCostEstimated[g.id];
      const cost = this.removeCargo(g.id, n);
      if (n && this.state.lastVoyage && this.state.voyage) {
        this.state.lastVoyage.cargoLossQuantity += n;
        this.state.lastVoyage.cargoLossCost += cost;
        this.state.lastVoyage.costBasisEstimated ||= estimated;
      }
      left -= n;
      lost += n;
      if (!left) break;
    }
    return lost;
  }
  advanceVoyage() {
    const v = this.state.voyage;
    if (!v) return;
    v.elapsedDays++;
    const suppliesUsed = Math.min(this.state.supplies, v.dailySupply);
    this.state.supplies -= suppliesUsed;
    if (this.state.lastVoyage) {
      this.state.lastVoyage.suppliesUsed += suppliesUsed;
      this.state.lastVoyage.suppliesCost += suppliesUsed * 2;
    }
    if (v.elapsedDays > v.totalDays) {
      const wages = Math.min(this.state.cash, this.state.fleetSize * 2);
      this.state.cash -= wages;
      v.wages += wages;
      if (this.state.lastVoyage) this.state.lastVoyage.wages += wages;
    }
    if (suppliesUsed < v.dailySupply) {
      this.state.ship.hull = Math.max(8, this.state.ship.hull - 4);
      this.state.reputation = Math.max(0, this.state.reputation - 0.2);
      this.log("\u98DF\u7269\u4E0E\u6DE1\u6C34\u4E0D\u8DB3\uFF0C\u8239\u5458\u75B2\u60EB\uFF0C\u8239\u4F53\u7EF4\u62A4\u4E2D\u65AD\u3002\u8BF7\u5C3D\u5FEB\u505C\u9760\u9644\u8FD1\u6E2F\u53E3\u3002");
    }
    const localHazards = navigationHazards(this.state.day).filter(
      (h) => distanceDegrees(h, this.state.navigation.position) < h.radius
    );
    const stormRisk = localHazards.some((h) => h.kind === "storm") ? 0.32 : v.risk * 0.2;
    const pirateRisk = localHazards.some((h) => h.kind === "pirate") ? 0.38 : v.risk * 0.11;
    const roll = this.random(`voyage:${v.fromId}:${v.toId}:${v.elapsedDays}`);
    if (roll < stormRisk) {
      const damage = 2 + Math.floor(v.risk * 15);
      this.state.ship.hull = Math.max(8, this.state.ship.hull - damage);
      const lost = this.loseCargo(Math.ceil(this.cargoCount() * 0.035));
      this.log(`\u98CE\u6D6A\u6765\u88AD\uFF0C\u8239\u4F53\u635F\u4F24 ${damage}\uFF0C\u635F\u5931 ${lost} \u5355\u4F4D\u8D27\u7269\u3002`);
    } else if (roll < stormRisk + pirateRisk) {
      if (v.strategy === "ransom") {
        const toll = Math.min(this.state.cash, 12 * this.state.fleetSize);
        this.state.cash -= toll;
        if (this.state.lastVoyage) this.state.lastVoyage.ransom += toll;
        this.log(`\u906D\u9047\u6D77\u76D7\uFF0C\u652F\u4ED8 ${toll} \u91D1\u5E01\u8D4E\u91D1\u540E\u5B89\u5168\u901A\u8FC7\u3002`);
      } else if (v.strategy === "avoid") {
        this.log("\u77AD\u671B\u624B\u63D0\u524D\u53D1\u73B0\u52AB\u63A0\u8239\uFF0C\u8239\u961F\u6CBF\u5B89\u5168\u822A\u9053\u7ED5\u884C\u3002");
      } else {
        const damage = v.strategy === "flee" ? 5 : 10;
        this.state.ship.hull = Math.max(8, this.state.ship.hull - damage);
        this.log(
          v.strategy === "flee" ? "\u8239\u961F\u5168\u5E06\u8131\u79BB\u8FFD\u51FB\uFF0C\u8239\u5177\u78E8\u635F\u589E\u52A0\u3002" : "\u8239\u961F\u81EA\u536B\u51FB\u9000\u52AB\u63A0\u8239\uFF0C\u8239\u4F53\u9700\u8981\u4FEE\u590D\u3002"
        );
      }
    } else if (roll > 0.985) {
      this.state.reputation = clamp(this.state.reputation + 1, 0, 100);
      this.log("\u6551\u52A9\u8FF7\u822A\u6E14\u8239\uFF0C\u5546\u6E2F\u4E4B\u95F4\u4F20\u5F00\u4E86\u5BB6\u65CF\u7684\u5584\u540D\u3002");
    }
  }
  routeDistance(route) {
    return route.reduce(
      (sum, p, i) => sum + (i ? distanceDegrees(route[i - 1], p) : 0),
      0
    );
  }
  sailingSpeed() {
    return 4.2 * this.state.ship.speed * this.life().bonuses().speed / (this.state.strategy === "avoid" ? 1.2 : 1);
  }
  navigationRemainingDays() {
    const n = this.state.navigation;
    return Math.ceil(
      this.routeDistance([n.position, ...n.route.slice(n.leg)]) / (this.state.voyage?.pace ?? this.sailingSpeed())
    );
  }
  nearbyPorts() {
    return this.availablePorts().filter(
      (p) => distanceDegrees(this.state.navigation.position, portPoint(p)) <= 1.2
    );
  }
  arrive(portId) {
    const v = this.state.voyage;
    if (!v) return false;
    if (this.state.lastVoyage) {
      this.state.lastVoyage.endedDay = this.state.day;
      this.state.lastVoyage.toId = portId;
    }
    this.state.currentPortId = portId;
    this.state.destinationId = null;
    this.state.voyage = null;
    const n = this.state.navigation;
    n.position = portPoint(this.port());
    n.route = [];
    n.leg = 0;
    n.targetId = null;
    n.manual = false;
    if (!n.discovered.includes(portId)) n.discovered.push(portId);
    if (!this.state.visited.includes(portId)) this.state.visited.push(portId);
    this.state.ship.hull = Math.max(8, this.state.ship.hull - 1);
    this.log(
      `\u5DF2\u505C\u9760${this.port().name}\uFF0C\u672C\u6B21\u5728\u6D77\u4E0A\u5EA6\u8FC7 ${v.elapsedDays} \u65E5\u3002\u5E02\u573A\u4E0E\u6E2F\u53E3\u5C45\u6C11\u5DF2\u53EF\u4EA4\u4E92\u3002`
    );
    return true;
  }
  dockAt(portId) {
    if (!this.state.voyage || !this.nearbyPorts().some((p) => p.id === portId))
      return this.fail("\u8BF7\u5148\u9A76\u5165\u8BE5\u6E2F\u53E3\u9644\u8FD1\u7684\u5F15\u822A\u6C34\u57DF\uFF0C\u518D\u7533\u8BF7\u505C\u9760\u3002");
    return this.arrive(portId);
  }
  redirect(destinationId) {
    if (!this.state.voyage || !this.availablePorts().some((p) => p.id === destinationId))
      return this.fail("\u8BF7\u9009\u62E9\u4E00\u4E2A\u5F00\u653E\u7684\u6E2F\u53E3\u3002");
    const n = this.state.navigation;
    const route = planSeaRoute(n.position, this.port(destinationId));
    if (route.length < 2)
      return this.fail("\u8FD9\u91CC\u6CA1\u6709\u627E\u5230\u8FDE\u901A\u6D77\u8DEF\uFF0C\u8BF7\u5148\u9A76\u79BB\u6D45\u6EE9\u3002");
    n.route = route;
    n.leg = 1;
    n.manual = false;
    n.throttle = 1;
    n.targetId = destinationId;
    this.state.destinationId = destinationId;
    this.state.voyage.toId = destinationId;
    this.state.voyage.pace = this.routeDistance(route) / Math.max(1, Math.ceil(this.routeDistance(route) / this.sailingSpeed()));
    if (this.state.lastVoyage) this.state.lastVoyage.toId = destinationId;
    this.log(
      `\u5DF2\u6539\u822A${this.port(destinationId).name}\u3002\u7ED5\u822A\u671F\u95F4\u7EE7\u7EED\u6D88\u8017\u8865\u7ED9\uFF0C\u8D85\u8FC7\u9884\u4ED8\u65E5\u6570\u53E6\u8BA1\u5DE5\u8D44\u3002`
    );
    return true;
  }
  setManual(enabled) {
    if (!this.state.voyage) return this.fail("\u51FA\u6E2F\u540E\u53EF\u4EE5\u624B\u52A8\u638C\u8235\u3002");
    if (!enabled) return this.redirect(this.state.destinationId);
    this.state.navigation.manual = true;
    this.log("\u5DF2\u4EA4\u63A5\u624B\u52A8\u638C\u8235\u3002\u5DE6\u53F3\u8C03\u6574\u822A\u5411\uFF0C\u4E0A\u4E0B\u8C03\u6574\u5E06\u901F\uFF1B\u63A5\u8FD1\u57CE\u5E02\u540E\u53EF\u505C\u9760\u3002");
    return true;
  }
  steer(turn, throttleDelta = 0) {
    if (!this.state.voyage || !Number.isFinite(turn) || !Number.isFinite(throttleDelta))
      return;
    const n = this.state.navigation;
    n.manual = true;
    n.heading = (n.heading + clamp(turn, -Math.PI, Math.PI) + Math.PI * 2) % (Math.PI * 2);
    n.throttle = clamp(n.throttle + throttleDelta, 0, 1);
  }
  steerToward(point2) {
    if (!this.state.voyage)
      return this.fail("\u5148\u9009\u62E9\u76EE\u7684\u6E2F\u542F\u822A\uFF0C\u518D\u70B9\u51FB\u6D77\u9762\u8C03\u6574\u822A\u5411\u3002");
    if (!Number.isFinite(point2.lon) || !Number.isFinite(point2.lat))
      return false;
    const n = this.state.navigation, delta = (point2.lon - n.position.lon + 540) % 360 - 180;
    n.heading = Math.atan2(
      delta * Math.cos(n.position.lat * Math.PI / 180),
      point2.lat - n.position.lat
    );
    n.manual = true;
    n.throttle = 1;
    this.log("\u77AD\u671B\u624B\u8BB0\u4E0B\u65B0\u822A\u5411\u3002\u6B63\u5728\u624B\u52A8\u822A\u884C\uFF0C\u7559\u610F\u524D\u65B9\u6D77\u5CB8\u4E0E\u98CE\u9669\u6C34\u57DF\u3002");
    return true;
  }
  advanceSailing(dayFraction) {
    const n = this.state.navigation;
    if (!this.state.voyage || !Number.isFinite(dayFraction) || dayFraction <= 0)
      return { arrived: false, blocked: false };
    if (!n.manual && !n.route.length) {
      n.route = planSeaRoute(n.position, this.port(this.state.destinationId));
      n.leg = 1;
      if (!n.route.length) return { arrived: false, blocked: true };
    }
    const result = advanceNavigation(
      n,
      (n.manual ? this.sailingSpeed() : this.state.voyage.pace ?? this.sailingSpeed()) * Math.min(1, dayFraction),
      this.state.day
    );
    for (const p of this.availablePorts()) {
      if (distanceDegrees(n.position, portPoint(p)) < 7 && !n.discovered.includes(p.id)) {
        n.discovered.push(p.id);
        this.state.reputation = clamp(this.state.reputation + 0.15, 0, 100);
      }
    }
    if (result.reached && n.targetId && this.nearbyPorts().some((p) => p.id === n.targetId))
      return { arrived: this.arrive(n.targetId), blocked: false };
    if (result.blocked) {
      n.throttle = 0;
      n.manual = true;
      this.state.lastEvent = "\u524D\u65B9\u6D45\u6EE9\u65E0\u6CD5\u901A\u822A\uFF0C\u5DF2\u6536\u5E06\u3002\u8C03\u6574\u822A\u5411\u5E76\u5347\u5E06\uFF0C\u6216\u8BA9\u9886\u822A\u5458\u91CD\u65B0\u89C4\u5212\u3002";
    }
    return { arrived: false, blocked: result.blocked };
  }
  nextDay(navigationHandled = false) {
    if (!this.state.started) return;
    this.state.day++;
    for (const message of this.dominion().daily().messages) this.log(message);
    for (const p of this.availablePorts())
      for (const id of Object.keys(this.state.stock[p.id])) {
        const g = goodById.get(id);
        if (!this.state.sandbox && g.era > this.state.eraIndex) continue;
        const stock = this.state.stock[p.id][g.id];
        const recovery = (100 - stock) * 0.04;
        const demand = p.demands.includes(g.id) ? -1 : p.produces.includes(g.id) ? 1 : 0;
        const competition = this.random(`traders:${p.id}:${g.id}`) > 0.65 ? -1 : 0;
        this.state.stock[p.id][g.id] = clamp(
          Math.round(stock + recovery + demand + competition),
          20,
          200
        );
      }
    if ((this.state.day - 1) % 4 === 0) this.publishMarketEvent();
    this.advanceVoyage();
    if (!navigationHandled) this.advanceSailing(1);
    this.checkCompletion();
  }
  repairCost() {
    return Math.ceil(
      (this.state.ship.maxHull - this.state.ship.hull) * 1.8 * this.state.fleetSize
    );
  }
  repair() {
    const cost = this.repairCost();
    if (!this.docked()) return this.fail("\u8BF7\u5728\u6E2F\u53E3\u7EF4\u4FEE\u3002");
    if (!cost) return this.fail("\u8239\u4F53\u5DF2\u7ECF\u5B8C\u597D\u3002");
    if (this.state.cash < cost) return this.fail(`\u7EF4\u4FEE\u9700\u8981 ${cost} \u91D1\u5E01\u3002`);
    this.state.cash -= cost;
    this.state.ship.hull = this.state.ship.maxHull;
    this.log(`\u8239\u575E\u7EF4\u4FEE\u5B8C\u6210\uFF0C\u652F\u4ED8 ${cost} \u91D1\u5E01\u3002`);
    return true;
  }
  upgradeCost() {
    return Math.round(480 * this.state.ship.level ** 1.4);
  }
  upgrade() {
    if (!this.docked()) return this.fail("\u8BF7\u5728\u6E2F\u53E3\u5347\u7EA7\u3002");
    if (this.state.ship.level >= this.state.eraIndex * 2 + 3)
      return this.fail("\u5F53\u524D\u7EAA\u5143\u8239\u8236\u6280\u672F\u5DF2\u7ECF\u8FBE\u5230\u4E0A\u9650\u3002");
    const cost = this.upgradeCost();
    if (this.state.cash < cost) return this.fail(`\u5347\u7EA7\u9700\u8981 ${cost} \u91D1\u5E01\u3002`);
    this.state.cash -= cost;
    this.state.ship.level++;
    this.state.ship.capacity += 10 * this.state.fleetSize;
    this.state.ship.maxHull += 12;
    this.state.ship.hull = this.state.ship.maxHull;
    this.state.ship.speed += 0.12;
    this.state.ship.name = eras[this.state.eraIndex].shipName;
    this.log(`\u5347\u7EA7\u4E3A ${this.state.ship.name} Lv.${this.state.ship.level}\u3002`);
    return true;
  }
  resupplyCost() {
    return Math.max(0, this.state.fleetSize * 100 - this.state.supplies) * 2;
  }
  resupply() {
    if (!this.docked()) return this.fail("\u8BF7\u5728\u6E2F\u53E3\u8865\u7ED9\u3002");
    const quantity = Math.max(
      0,
      Math.min(
        this.state.fleetSize * 100 - this.state.supplies,
        Math.floor(this.state.cash / 2)
      )
    );
    if (!quantity) return this.fail("\u8865\u7ED9\u5DF2\u6EE1\u6216\u91D1\u5E01\u4E0D\u8DB3\u3002");
    this.state.cash -= quantity * 2;
    this.state.supplies += quantity;
    this.log(`\u8865\u5145 ${quantity} \u4EFD\u98DF\u7269\u4E0E\u6DE1\u6C34\uFF0C\u652F\u4ED8 ${quantity * 2} \u91D1\u5E01\u3002`);
    return true;
  }
  shipCost() {
    return Math.round(950 * this.state.fleetSize ** 1.5);
  }
  buyShip() {
    if (!this.docked()) return this.fail("\u8BF7\u5728\u6E2F\u53E3\u8D2D\u8239\u3002");
    if (this.state.fleetSize >= 5) return this.fail("\u8239\u961F\u5DF2\u8FBE\u5230 5 \u8258\u4E0A\u9650\u3002");
    const cost = this.shipCost();
    if (this.state.cash < cost) return this.fail(`\u8D2D\u8239\u9700\u8981 ${cost} \u91D1\u5E01\u3002`);
    this.state.cash -= cost;
    this.state.fleetSize++;
    this.state.ship.capacity += 30 + (this.state.ship.level - 1) * 10;
    this.log(`\u65B0\u5546\u8239\u52A0\u5165\u8239\u961F\uFF0C\u76EE\u524D\u5171 ${this.state.fleetSize} \u8258\u3002`);
    return true;
  }
  investmentCost() {
    return 800 * ((this.state.investments[this.state.currentPortId] || 0) + 1);
  }
  invest() {
    if (!this.docked() || this.state.eraIndex < 2)
      return this.fail("\u7B2C\u4E09\u7EAA\u5143\u8D77\u53EF\u5728\u6E2F\u53E3\u6295\u8D44\u3002");
    const n = this.state.investments[this.state.currentPortId] || 0;
    if (n >= 5) return this.fail("\u8BE5\u6E2F\u53E3\u5546\u4E1A\u8BBE\u65BD\u5DF2\u8FBE\u5230 5 \u7EA7\u3002");
    const cost = this.investmentCost();
    if (this.state.cash < cost) return this.fail(`\u6295\u8D44\u9700\u8981 ${cost} \u91D1\u5E01\u3002`);
    this.state.cash -= cost;
    this.state.investments[this.state.currentPortId] = n + 1;
    this.state.reputation = clamp(this.state.reputation + 2, 0, 100);
    this.log(`${this.port().name}\u5546\u4E1A\u6295\u8D44\u5347\u81F3 ${n + 1} \u7EA7\uFF0C\u6E2F\u7A0E\u964D\u4F4E\u3002`);
    return true;
  }
  setStrategy(strategy) {
    if (!["avoid", "ransom", "flee", "defend"].includes(strategy)) return false;
    if (this.state.voyage) return this.fail("\u822A\u884C\u4E2D\u4FDD\u6301\u51FA\u6E2F\u65F6\u5236\u5B9A\u7684\u9884\u6848\u3002");
    this.state.strategy = strategy;
    return true;
  }
  advanceEra() {
    if (!this.docked()) return this.fail("\u8BF7\u5728\u6E2F\u53E3\u5F00\u542F\u65B0\u7EAA\u5143\u3002");
    const next = eras[this.state.eraIndex + 1];
    if (!next) return this.fail("\u5DF2\u62B5\u8FBE\u6700\u540E\u7EAA\u5143\u3002");
    if (this.assets() < next.threshold)
      return this.fail(`\u5F00\u542F\u4E0B\u4E00\u7EAA\u5143\u9700\u8981 ${next.threshold} \u53EF\u5151\u73B0\u8D44\u4EA7\u3002`);
    this.state.eraIndex++;
    this.state.generation++;
    this.state.ship.capacity += 15 * this.state.fleetSize;
    this.state.ship.speed += 0.08;
    this.state.ship.name = next.shipName;
    this.log(
      `\u7B2C ${this.state.generation} \u4EE3\u5546\u4EBA\u63A5\u8FC7\u5BB6\u65CF\u8D26\u518C\uFF0C\u8FDB\u5165\u300C${next.title}\u300D\u3002\u65B0\u7684\u6E2F\u53E3\u4E0E\u8D27\u7269\u5F00\u653E\u3002`
    );
    return true;
  }
  checkCompletion() {
    if (!this.state.sandboxUnlocked && this.state.eraIndex === eras.length - 1 && this.assets() >= 5e7) {
      this.state.sandboxUnlocked = true;
      this.log("\u5168\u7403\u5546\u4E1A\u7F51\u7EDC\u5EFA\u6210\uFF0C\u65E0\u5C3D\u6C99\u76D2\u5DF2\u89E3\u9501\u3002");
    }
  }
  startSandbox() {
    this.checkCompletion();
    if (!this.state.sandboxUnlocked)
      return this.fail("\u5B8C\u6210\u6700\u540E\u7EAA\u5143\u5E76\u8FBE\u5230 5000 \u4E07\u8D44\u4EA7\u540E\u89E3\u9501\u6C99\u76D2\u3002");
    if (!this.docked()) return this.fail("\u8BF7\u5148\u62B5\u6E2F\u3002");
    this.state.sandbox = true;
    this.state.eraIndex = eras.length - 1;
    this.log("\u5DF2\u8FDB\u5165\u65E0\u5C3D\u6C99\u76D2\uFF0C\u5168\u90E8\u6E2F\u53E3\u4E0E\u5546\u54C1\u5F00\u653E\u3002");
    return true;
  }
  export() {
    return JSON.stringify(this.state);
  }
  import(serialized) {
    try {
      if (serialized.length > 5e6) return false;
      const raw = JSON.parse(serialized);
      if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.version !== void 0 && raw.version !== 2)
        return false;
      const numeric = (x, min = 0, max = 1e12) => typeof x === "number" && Number.isFinite(x) && x >= min && x <= max;
      const integer2 = (x, min = 0, max = 1e12) => numeric(x, min, max) && Number.isInteger(x);
      if (!integer2(raw.day, 1, 1e9) || !integer2(raw.eraIndex, 0, 10) || !numeric(raw.cash) || !numeric(raw.reputation, 0, 100) || typeof raw.started !== "boolean" || !ports.some((p) => p.id === raw.currentPortId))
        return false;
      const next = fresh();
      const ship = raw.ship;
      if (!ship || !integer2(ship.level, 1, 30) || !integer2(ship.capacity, 1, 1e4) || !numeric(ship.maxHull, 1, 5e3) || !numeric(ship.hull, 0, ship.maxHull) || !numeric(ship.speed, 0.1, 20) || typeof ship.name !== "string" || ship.name.length > 80)
        return false;
      Object.assign(next, {
        day: raw.day,
        eraIndex: raw.eraIndex,
        cash: raw.cash,
        reputation: raw.reputation,
        started: raw.started,
        currentPortId: raw.currentPortId,
        ship: {
          name: ship.name,
          level: ship.level,
          capacity: ship.capacity,
          hull: ship.hull,
          maxHull: ship.maxHull,
          speed: ship.speed
        }
      });
      if (!raw.cargo || typeof raw.cargo !== "object") return false;
      for (const g of goods) {
        const amount = raw.cargo[g.id] ?? 0;
        if (!integer2(amount, 0, 1e4)) return false;
        if (amount && g.era > next.eraIndex && !raw.sandbox && raw.version === 2)
          return false;
        if (amount && raw.version === void 0)
          next.eraIndex = Math.max(next.eraIndex, g.era);
        next.cargo[g.id] = amount;
      }
      const life = readLifeState(raw.life, next.day);
      if (!life) return false;
      next.life = life;
      const bonusCapacity = new PortLife(life, {
        day: next.day,
        eraIndex: next.eraIndex,
        currentPortId: next.currentPortId,
        cash: next.cash,
        atSea: false,
        supplies: 0,
        shipCapacity: ship.capacity,
        cargo: () => 0,
        marketGoods: () => [],
        spendCash: () => false,
        addCash: () => {
        },
        consumeCargo: () => false,
        addReputation: () => {
        }
      }).bonuses().capacity;
      if (Object.values(next.cargo).reduce((a, b) => a + b, 0) > ship.capacity + bonusCapacity)
        return false;
      if (raw.version === 2) {
        if (!integer2(raw.fleetSize, 1, 5) || !numeric(raw.supplies, 0, raw.fleetSize * 100) || !origins.some((o) => o.id === raw.originId) || !["avoid", "ransom", "flee", "defend"].includes(raw.strategy) || typeof raw.sandbox !== "boolean" || typeof raw.sandboxUnlocked !== "boolean" || !integer2(raw.generation, 1, 1e4) || !Array.isArray(raw.logs) || raw.logs.some(
          (l) => typeof l !== "string" || l.length > 600
        ) || !Array.isArray(raw.visited) || raw.visited.some((id) => !ports.some((p) => p.id === id)) || !numeric(raw.profits))
          return false;
        Object.assign(next, {
          fleetSize: raw.fleetSize,
          supplies: raw.supplies,
          originId: raw.originId,
          strategy: raw.strategy,
          sandbox: raw.sandbox,
          sandboxUnlocked: raw.sandboxUnlocked,
          generation: raw.generation,
          logs: raw.logs.slice(-100),
          visited: [...new Set(raw.visited)],
          profits: raw.profits
        });
        for (const p of ports) {
          const investment = raw.investments?.[p.id] ?? 0;
          if (!integer2(investment, 0, 5)) return false;
          next.investments[p.id] = investment;
          const inventory = raw.stock?.[p.id];
          if (inventory !== void 0 && (!inventory || typeof inventory !== "object" || Array.isArray(inventory)))
            return false;
          for (const id of /* @__PURE__ */ new Set([
            ...Object.keys(next.stock[p.id]),
            ...Object.keys(inventory ?? {})
          ])) {
            if (!goodById.has(id)) return false;
            const n = inventory?.[id] ?? next.stock[p.id][id] ?? 0;
            if (!integer2(n, 0, 2e4)) return false;
            if (id in next.stock[p.id] || n !== 100) next.stock[p.id][id] = n;
          }
        }
        if (raw.voyage) {
          const v = raw.voyage;
          if (!v || v.fromId !== raw.currentPortId || v.toId !== raw.destinationId || !ports.some(
            (p) => p.id === v.toId && (p.era <= next.eraIndex || next.sandbox)
          ) || !integer2(v.totalDays, 1, 1e3) || !integer2(v.elapsedDays, 0, 1e6) || !numeric(v.risk, 0, 1) || !["avoid", "ransom", "flee", "defend"].includes(v.strategy) || !numeric(v.dailySupply, 1, 100) || !numeric(v.wages, 0, 1e6) || v.pace !== void 0 && !numeric(v.pace, 1e-5, 100))
            return false;
          next.voyage = {
            ...v.pace !== void 0 ? { pace: v.pace } : {},
            fromId: v.fromId,
            toId: v.toId,
            totalDays: v.totalDays,
            elapsedDays: v.elapsedDays,
            risk: v.risk,
            strategy: v.strategy,
            dailySupply: v.dailySupply,
            wages: v.wages
          };
          next.destinationId = v.toId;
        } else if (raw.destinationId !== null) return false;
      }
      if (raw.version === void 0)
        next.eraIndex = Math.max(
          next.eraIndex,
          this.port(next.currentPortId).era
        );
      if (ports.find((p) => p.id === next.currentPortId).era > next.eraIndex && !next.sandbox)
        return false;
      const marketEvents = readMarketEvents(
        raw.marketEvents,
        next.day,
        ports.filter((port2) => port2.era <= next.eraIndex || next.sandbox),
        goods.filter((good2) => good2.era <= next.eraIndex || next.sandbox)
      );
      if (marketEvents === null) return false;
      next.marketEvents = marketEvents;
      const accountingKeys = [
        "cargoCost",
        "cargoCostEstimated",
        "tradeLedger",
        "lastTrade",
        "lastVoyage"
      ];
      const hasAccounting = accountingKeys.some(
        (key) => raw[key] !== void 0
      );
      if (!hasAccounting) {
        for (const good2 of goods) {
          next.cargoCost[good2.id] = next.cargo[good2.id] * good2.base;
          next.cargoCostEstimated[good2.id] = next.cargo[good2.id] > 0;
        }
        next.tradeLedger.sinceDay = next.day;
        if (next.voyage) {
          next.lastVoyage = {
            fromId: next.voyage.fromId,
            toId: next.voyage.toId,
            startedDay: Math.max(1, next.day - next.voyage.elapsedDays),
            endedDay: null,
            wages: next.voyage.wages,
            transfer: 0,
            suppliesUsed: 0,
            suppliesCost: 0,
            ransom: 0,
            cargoLossQuantity: 0,
            cargoLossCost: 0,
            costBasisEstimated: false,
            partial: true
          };
        }
      } else {
        if (accountingKeys.some((key) => raw[key] === void 0)) return false;
        const record = (value) => !!value && typeof value === "object" && !Array.isArray(value);
        const close = (actual, expected) => Math.abs(actual - expected) <= Number.EPSILON * 64 * Math.max(1, Math.abs(actual), Math.abs(expected));
        const knownPort = (id) => ports.some(
          (port2) => port2.id === id && (port2.era <= next.eraIndex || next.sandbox)
        );
        if (!record(raw.cargoCost) || !record(raw.cargoCostEstimated) || Object.keys(raw.cargoCost).some(
          (id) => !goods.some((good2) => good2.id === id)
        ) || Object.keys(raw.cargoCostEstimated).some(
          (id) => !goods.some((good2) => good2.id === id)
        ))
          return false;
        for (const good2 of goods) {
          const quantity = next.cargo[good2.id], cost = raw.cargoCost[good2.id] ?? (quantity === 0 ? 0 : void 0), estimated = raw.cargoCostEstimated[good2.id] ?? (quantity === 0 ? false : void 0);
          if (!numeric(cost, 0, quantity * good2.base * 10) || typeof estimated !== "boolean" || !quantity && (cost !== 0 || estimated) || quantity > 0 && cost <= 0)
            return false;
          next.cargoCost[good2.id] = cost;
          next.cargoCostEstimated[good2.id] = estimated;
        }
        const ledger = raw.tradeLedger;
        if (!record(ledger) || !integer2(ledger.sinceDay, 1, next.day) || !integer2(ledger.revenue) || !numeric(ledger.costBasis) || !numeric(ledger.realizedTradingProfit, -1e12) || typeof ledger.costBasisEstimated !== "boolean" || !close(
          ledger.realizedTradingProfit,
          ledger.revenue - ledger.costBasis
        ) || ledger.revenue === 0 && (ledger.costBasis !== 0 || ledger.costBasisEstimated))
          return false;
        next.tradeLedger = {
          sinceDay: ledger.sinceDay,
          revenue: ledger.revenue,
          costBasis: ledger.costBasis,
          realizedTradingProfit: ledger.realizedTradingProfit,
          costBasisEstimated: ledger.costBasisEstimated
        };
        if (raw.lastTrade !== null) {
          const receipt = raw.lastTrade;
          if (!record(receipt) || !integer2(receipt.day, next.tradeLedger.sinceDay, next.day) || !knownPort(receipt.portId) || !goods.some(
            (good2) => good2.id === receipt.goodId && (good2.era <= next.eraIndex || next.sandbox)
          ) || !["buy", "sell"].includes(receipt.side) || !integer2(receipt.quantity, 1, 1e4) || !integer2(receipt.total, 1) || !numeric(receipt.costBasis, 1e-7) || typeof receipt.costBasisEstimated !== "boolean")
            return false;
          if (receipt.side === "buy") {
            if (receipt.tradingProfit !== null || receipt.costBasis !== receipt.total || receipt.costBasisEstimated)
              return false;
          } else if (!numeric(receipt.tradingProfit, -1e12) || !close(
            receipt.tradingProfit,
            receipt.total - receipt.costBasis
          ) || receipt.total > next.tradeLedger.revenue || receipt.costBasis > next.tradeLedger.costBasis + 1e-7 || receipt.costBasisEstimated && !next.tradeLedger.costBasisEstimated)
            return false;
          next.lastTrade = {
            day: receipt.day,
            portId: receipt.portId,
            goodId: receipt.goodId,
            side: receipt.side,
            quantity: receipt.quantity,
            total: receipt.total,
            costBasis: receipt.costBasis,
            tradingProfit: receipt.tradingProfit,
            costBasisEstimated: receipt.costBasisEstimated
          };
        }
        if (raw.lastVoyage !== null) {
          const report = raw.lastVoyage;
          if (!record(report) || !knownPort(report.fromId) || !knownPort(report.toId) || !integer2(report.startedDay, 1, next.day) || report.endedDay !== null && !integer2(
            report.endedDay,
            report.startedDay,
            next.day
          ) || !integer2(report.wages, 0, 1e6) || ![0, 12].includes(report.transfer) || !numeric(report.suppliesUsed, 0, 1e5) || !numeric(report.suppliesCost, 0, 2e5) || report.suppliesCost !== report.suppliesUsed * 2 || !integer2(report.ransom, 0, 1e6) || !integer2(report.cargoLossQuantity, 0, 1e4) || !numeric(report.cargoLossCost) || typeof report.costBasisEstimated !== "boolean" || typeof report.partial !== "boolean" || report.cargoLossQuantity === 0 && (report.cargoLossCost !== 0 || report.costBasisEstimated) || report.cargoLossQuantity > 0 && report.cargoLossCost <= 0)
            return false;
          if (next.voyage) {
            if (report.endedDay !== null || report.fromId !== next.voyage.fromId || report.toId !== next.voyage.toId || report.wages !== next.voyage.wages || report.suppliesUsed > next.voyage.elapsedDays * next.voyage.dailySupply || report.startedDay !== Math.max(1, next.day - next.voyage.elapsedDays))
              return false;
          } else if (report.endedDay === null) return false;
          next.lastVoyage = {
            fromId: report.fromId,
            toId: report.toId,
            startedDay: report.startedDay,
            endedDay: report.endedDay,
            wages: report.wages,
            transfer: report.transfer,
            suppliesUsed: report.suppliesUsed,
            suppliesCost: report.suppliesCost,
            ransom: report.ransom,
            cargoLossQuantity: report.cargoLossQuantity,
            cargoLossCost: report.cargoLossCost,
            costBasisEstimated: report.costBasisEstimated,
            partial: report.partial
          };
        } else if (next.voyage) return false;
      }
      if (raw.routeRisk !== void 0 && !numeric(raw.routeRisk, 0, 1))
        return false;
      next.routeRisk = raw.routeRisk ?? 0;
      next.lastEvent = typeof raw.lastEvent === "string" ? raw.lastEvent.slice(0, 600) : "\u672C\u5730\u822A\u7A0B\u5DF2\u6062\u590D";
      const rawNavigation = raw.version === 2 ? raw.navigation : void 0;
      const navigation = readNavigation(
        rawNavigation,
        this.port(next.currentPortId),
        ports.filter((p) => p.era <= next.eraIndex || next.sandbox)
      );
      if (!navigation) return false;
      if (rawNavigation && (navigation.targetId !== next.destinationId || !next.voyage && distanceDegrees(
        navigation.position,
        portPoint(this.port(next.currentPortId))
      ) > 0.01))
        return false;
      if (!rawNavigation) {
        navigation.targetId = next.destinationId;
        navigation.discovered = [...next.visited];
      }
      next.navigation = navigation;
      const dominion = readDominionState(raw.dominion, next.day);
      if (!dominion) return false;
      next.dominion = dominion;
      this.state = next;
      return true;
    } catch {
      return false;
    }
  }
};

// public/data/land.geojson
var land_default = { type: "FeatureCollection", name: "ne_110m_land_with_selected_50m_islands", crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } }, features: [{ type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-66.290031, -81.000327, -59.572095, -79.628679], geometry: { type: "Polygon", coordinates: [[[-59.572095, -80.040179], [-59.865849, -80.549657], [-60.159656, -81.000327], [-62.255393, -80.863178], [-64.488125, -80.921934], [-65.741666, -80.588827], [-65.741666, -80.549657], [-66.290031, -80.255773], [-64.037688, -80.294944], [-61.883246, -80.39287], [-61.138976, -79.981371], [-60.610119, -79.628679], [-59.572095, -80.040179]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-163.712896, -79.634209, -159.208184, -78.223338], geometry: { type: "Polygon", coordinates: [[[-159.208184, -79.497059], [-161.127601, -79.634209], [-162.439847, -79.281465], [-163.027408, -78.928774], [-163.066604, -78.869966], [-163.712896, -78.595667], [-163.712896, -78.595667], [-163.105801, -78.223338], [-161.245113, -78.380176], [-160.246208, -78.693645], [-159.482405, -79.046338], [-159.208184, -79.497059]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 0 }, bbox: [-54.164259, -81.025442, -43.333267, -77.831476], geometry: { type: "Polygon", coordinates: [[[-45.154758, -78.04707], [-43.920828, -78.478103], [-43.48995, -79.08556], [-43.372438, -79.516645], [-43.333267, -80.026123], [-44.880537, -80.339644], [-46.506174, -80.594357], [-48.386421, -80.829485], [-50.482107, -81.025442], [-52.851988, -80.966685], [-54.164259, -80.633528], [-53.987991, -80.222028], [-51.853134, -79.94773], [-50.991326, -79.614623], [-50.364595, -79.183487], [-49.914131, -78.811209], [-49.306959, -78.458569], [-48.660616, -78.047018], [-48.660616, -78.047019], [-48.151396, -78.04707], [-46.662857, -77.831476], [-45.154758, -78.04707]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-122.621735, -74.08881, -118.724143, -73.324619], geometry: { type: "Polygon", coordinates: [[[-121.211511, -73.50099], [-119.918851, -73.657725], [-118.724143, -73.481353], [-119.292119, -73.834097], [-120.232217, -74.08881], [-121.62283, -74.010468], [-122.621735, -73.657778], [-122.621735, -73.657777], [-122.406245, -73.324619], [-121.211511, -73.50099]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-127.28313, -73.873268, -124.031882, -73.246226], geometry: { type: "Polygon", coordinates: [[[-125.559566, -73.481353], [-124.031882, -73.873268], [-124.619469, -73.834097], [-125.912181, -73.736118], [-127.28313, -73.461769], [-127.28313, -73.461768], [-126.558472, -73.246226], [-125.559566, -73.481353]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-102.330725, -72.521205, -96.20035, -71.717792], geometry: { type: "Polygon", coordinates: [[[-98.98155, -71.933334], [-97.884743, -72.070535], [-96.787937, -71.952971], [-96.20035, -72.521205], [-96.983765, -72.442864], [-98.198083, -72.482035], [-99.432013, -72.442864], [-100.783455, -72.50162], [-101.801868, -72.305663], [-102.330725, -71.894164], [-102.330725, -71.894164], [-101.703967, -71.717792], [-100.430919, -71.854993], [-98.98155, -71.933334]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-75.012625, -72.503842, -68.333834, -68.87874], geometry: { type: "Polygon", coordinates: [[[-68.451346, -70.955823], [-68.333834, -71.406493], [-68.510128, -71.798407], [-68.784297, -72.170736], [-69.959471, -72.307885], [-71.075889, -72.503842], [-72.388134, -72.484257], [-71.8985, -72.092343], [-73.073622, -72.229492], [-74.19004, -72.366693], [-74.953895, -72.072757], [-75.012625, -71.661258], [-73.915819, -71.269345], [-73.915819, -71.269344], [-73.230331, -71.15178], [-72.074717, -71.190951], [-71.780962, -70.681473], [-71.72218, -70.309196], [-71.741791, -69.505782], [-71.173815, -69.035475], [-70.253252, -68.87874], [-69.724447, -69.251017], [-69.489422, -69.623346], [-69.058518, -70.074016], [-68.725541, -70.505153], [-68.451346, -70.955823]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-180, -90, 180, -63.27066], geometry: { type: "Polygon", coordinates: [[[-58.614143, -64.152467], [-59.045073, -64.36801], [-59.789342, -64.211223], [-60.611928, -64.309202], [-61.297416, -64.54433], [-62.0221, -64.799094], [-62.51176, -65.09303], [-62.648858, -65.484942], [-62.590128, -65.857219], [-62.120079, -66.190326], [-62.805567, -66.425505], [-63.74569, -66.503847], [-64.294106, -66.837004], [-64.881693, -67.150474], [-65.508425, -67.58161], [-65.665082, -67.953887], [-65.312545, -68.365335], [-64.783715, -68.678908], [-63.961103, -68.913984], [-63.1973, -69.227556], [-62.785955, -69.619419], [-62.570516, -69.991747], [-62.276736, -70.383661], [-61.806661, -70.716768], [-61.512906, -71.089045], [-61.375809, -72.010074], [-61.081977, -72.382351], [-61.003661, -72.774265], [-60.690269, -73.166179], [-60.827367, -73.695242], [-61.375809, -74.106742], [-61.96337, -74.439848], [-63.295201, -74.576997], [-63.74569, -74.92974], [-64.352836, -75.262847], [-65.860987, -75.635124], [-67.192818, -75.79191], [-68.446282, -76.007452], [-69.797724, -76.222995], [-70.600724, -76.634494], [-72.206776, -76.673665], [-73.969536, -76.634494], [-75.555977, -76.712887], [-77.24037, -76.712887], [-76.926979, -77.104802], [-75.399294, -77.28107], [-74.282876, -77.55542], [-73.656119, -77.908112], [-74.772536, -78.221633], [-76.4961, -78.123654], [-77.925858, -78.378419], [-77.984666, -78.789918], [-78.023785, -79.181833], [-76.848637, -79.514939], [-76.633224, -79.887216], [-75.360097, -80.259545], [-73.244852, -80.416331], [-71.442946, -80.69063], [-70.013163, -81.004151], [-68.191646, -81.317672], [-65.704279, -81.474458], [-63.25603, -81.748757], [-61.552026, -82.042692], [-59.691416, -82.37585], [-58.712121, -82.846106], [-58.222487, -83.218434], [-57.008117, -82.865691], [-55.362894, -82.571755], [-53.619771, -82.258235], [-51.543644, -82.003521], [-49.76135, -81.729171], [-47.273931, -81.709586], [-44.825708, -81.846735], [-42.808363, -82.081915], [-42.16202, -81.65083], [-40.771433, -81.356894], [-38.244818, -81.337309], [-36.26667, -81.121715], [-34.386397, -80.906172], [-32.310296, -80.769023], [-30.097098, -80.592651], [-28.549802, -80.337938], [-29.254901, -79.985195], [-29.685805, -79.632503], [-29.685805, -79.260226], [-31.624808, -79.299397], [-33.681324, -79.456132], [-35.639912, -79.456132], [-35.914107, -79.083855], [-35.77701, -78.339248], [-35.326546, -78.123654], [-33.896763, -77.888526], [-32.212369, -77.65345], [-30.998051, -77.359515], [-29.783732, -77.065579], [-28.882779, -76.673665], [-27.511752, -76.497345], [-26.160336, -76.360144], [-25.474822, -76.281803], [-23.927552, -76.24258], [-22.458598, -76.105431], [-21.224694, -75.909474], [-20.010375, -75.674346], [-18.913543, -75.439218], [-17.522982, -75.125698], [-16.641589, -74.79254], [-15.701491, -74.498604], [-15.40771, -74.106742], [-16.46532, -73.871614], [-16.112784, -73.460114], [-15.446855, -73.146542], [-14.408805, -72.950585], [-13.311973, -72.715457], [-12.293508, -72.401936], [-11.510067, -72.010074], [-11.020433, -71.539767], [-10.295774, -71.265416], [-9.101015, -71.324224], [-8.611381, -71.65733], [-7.416622, -71.696501], [-7.377451, -71.324224], [-6.868232, -70.93231], [-5.790985, -71.030289], [-5.536375, -71.402617], [-4.341667, -71.461373], [-3.048981, -71.285053], [-1.795492, -71.167438], [-0.659489, -71.226246], [-0.228637, -71.637745], [0.868195, -71.304639], [1.886686, -71.128267], [3.022638, -70.991118], [4.139055, -70.853917], [5.157546, -70.618789], [6.273912, -70.462055], [7.13572, -70.246512], [7.742866, -69.893769], [8.48711, -70.148534], [9.525135, -70.011333], [10.249845, -70.48164], [10.817821, -70.834332], [11.953824, -70.638375], [12.404287, -70.246512], [13.422778, -69.972162], [14.734998, -70.030918], [15.126757, -70.403247], [15.949342, -70.030918], [17.026589, -69.913354], [18.201711, -69.874183], [19.259373, -69.893769], [20.375739, -70.011333], [21.452985, -70.07014], [21.923034, -70.403247], [22.569403, -70.697182], [23.666184, -70.520811], [24.841357, -70.48164], [25.977309, -70.48164], [27.093726, -70.462055], [28.09258, -70.324854], [29.150242, -70.20729], [30.031583, -69.93294], [30.971733, -69.75662], [31.990172, -69.658641], [32.754053, -69.384291], [33.302443, -68.835642], [33.870419, -68.502588], [34.908495, -68.659271], [35.300202, -69.012014], [36.16201, -69.247142], [37.200035, -69.168748], [37.905108, -69.52144], [38.649404, -69.776205], [39.667894, -69.541077], [40.020431, -69.109941], [40.921358, -68.933621], [41.959434, -68.600514], [42.938702, -68.463313], [44.113876, -68.267408], [44.897291, -68.051866], [45.719928, -67.816738], [46.503343, -67.601196], [47.44344, -67.718759], [48.344419, -67.366068], [48.990736, -67.091718], [49.930885, -67.111303], [50.753471, -66.876175], [50.949325, -66.523484], [51.791547, -66.249133], [52.614133, -66.053176], [53.613038, -65.89639], [54.53355, -65.818049], [55.414943, -65.876805], [56.355041, -65.974783], [57.158093, -66.249133], [57.255968, -66.680218], [58.137361, -67.013324], [58.744508, -67.287675], [59.939318, -67.405239], [60.605221, -67.679589], [61.427806, -67.953887], [62.387489, -68.012695], [63.19049, -67.816738], [64.052349, -67.405239], [64.992447, -67.620729], [65.971715, -67.738345], [66.911864, -67.855909], [67.891133, -67.934302], [68.890038, -67.934302], [69.712624, -68.972791], [69.673453, -69.227556], [69.555941, -69.678226], [68.596258, -69.93294], [67.81274, -70.305268], [67.949889, -70.697182], [69.066307, -70.677545], [68.929157, -71.069459], [68.419989, -71.441788], [67.949889, -71.853287], [68.71377, -72.166808], [69.869307, -72.264787], [71.024895, -72.088415], [71.573285, -71.696501], [71.906288, -71.324224], [72.454627, -71.010703], [73.08141, -70.716768], [73.33602, -70.364024], [73.864877, -69.874183], [74.491557, -69.776205], [75.62756, -69.737034], [76.626465, -69.619419], [77.644904, -69.462684], [78.134539, -69.07077], [78.428371, -68.698441], [79.113859, -68.326216], [80.093127, -68.071503], [80.93535, -67.875546], [81.483792, -67.542388], [82.051767, -67.366068], [82.776426, -67.209282], [83.775331, -67.30726], [84.676206, -67.209282], [85.655527, -67.091718], [86.752359, -67.150474], [87.477017, -66.876175], [87.986289, -66.209911], [88.358411, -66.484261], [88.828408, -66.954568], [89.67063, -67.150474], [90.630365, -67.228867], [91.5901, -67.111303], [92.608539, -67.189696], [93.548637, -67.209282], [94.17542, -67.111303], [95.017591, -67.170111], [95.781472, -67.385653], [96.682399, -67.248504], [97.759646, -67.248504], [98.68021, -67.111303], [99.718182, -67.248504], [100.384188, -66.915346], [100.893356, -66.58224], [101.578896, -66.30789], [102.832411, -65.563284], [103.478676, -65.700485], [104.242557, -65.974783], [104.90846, -66.327527], [106.181561, -66.934931], [107.160881, -66.954568], [108.081393, -66.954568], [109.15864, -66.837004], [110.235835, -66.699804], [111.058472, -66.425505], [111.74396, -66.13157], [112.860378, -66.092347], [113.604673, -65.876805], [114.388088, -66.072762], [114.897308, -66.386283], [115.602381, -66.699804], [116.699161, -66.660633], [117.384701, -66.915346], [118.57946, -67.170111], [119.832924, -67.268089], [120.871, -67.189696], [121.654415, -66.876175], [122.320369, -66.562654], [123.221296, -66.484261], [124.122274, -66.621462], [125.160247, -66.719389], [126.100396, -66.562654], [127.001427, -66.562654], [127.882768, -66.660633], [128.80328, -66.758611], [129.704259, -66.58224], [130.781454, -66.425505], [131.799945, -66.386283], [132.935896, -66.386283], [133.85646, -66.288304], [134.757387, -66.209963], [135.031582, -65.72007], [135.070753, -65.308571], [135.697485, -65.582869], [135.873805, -66.033591], [136.206705, -66.44509], [136.618049, -66.778197], [137.460271, -66.954568], [138.596223, -66.895761], [139.908442, -66.876175], [140.809421, -66.817367], [142.121692, -66.817367], [143.061842, -66.797782], [144.374061, -66.837004], [145.490427, -66.915346], [146.195552, -67.228867], [145.999699, -67.601196], [146.646067, -67.895131], [147.723263, -68.130259], [148.839629, -68.385024], [150.132314, -68.561292], [151.483705, -68.71813], [152.502247, -68.874813], [153.638199, -68.894502], [154.284567, -68.561292], [155.165857, -68.835642], [155.92979, -69.149215], [156.811132, -69.384291], [158.025528, -69.482269], [159.181013, -69.599833], [159.670699, -69.991747], [160.80665, -70.226875], [161.570479, -70.579618], [162.686897, -70.736353], [163.842434, -70.716768], [164.919681, -70.775524], [166.11444, -70.755938], [167.309095, -70.834332], [168.425616, -70.971481], [169.463589, -71.20666], [170.501665, -71.402617], [171.20679, -71.696501], [171.089227, -72.088415], [170.560422, -72.441159], [170.109958, -72.891829], [169.75737, -73.24452], [169.287321, -73.65602], [167.975101, -73.812806], [167.387489, -74.165498], [166.094803, -74.38104], [165.644391, -74.772954], [164.958851, -75.145283], [164.234193, -75.458804], [163.822797, -75.870303], [163.568239, -76.24258], [163.47026, -76.693302], [163.489897, -77.065579], [164.057873, -77.457442], [164.273363, -77.82977], [164.743464, -78.182514], [166.604126, -78.319611], [166.995781, -78.750748], [165.193876, -78.907483], [163.666217, -79.123025], [161.766385, -79.162248], [160.924162, -79.730482], [160.747894, -80.200737], [160.316964, -80.573066], [159.788211, -80.945395], [161.120016, -81.278501], [161.629287, -81.690001], [162.490992, -82.062278], [163.705336, -82.395435], [165.095949, -82.708956], [166.604126, -83.022477], [168.895665, -83.335998], [169.404782, -83.825891], [172.283934, -84.041433], [172.477049, -84.117914], [173.224083, -84.41371], [175.985672, -84.158997], [178.277212, -84.472518], [180, -84.71338], [180, -90], [-180, -90], [-180, -84.71338], [-179.942499, -84.721443], [-179.058677, -84.139412], [-177.256772, -84.452933], [-177.140807, -84.417941], [-176.861993, -84.333812], [-176.523952, -84.231811], [-176.230303, -84.143203], [-176.084673, -84.099259], [-175.934101, -84.101591], [-175.829882, -84.117914], [-174.382503, -84.534323], [-173.116559, -84.117914], [-172.889106, -84.061019], [-169.951223, -83.884647], [-168.999989, -84.117914], [-168.530199, -84.23739], [-167.022099, -84.570497], [-164.182144, -84.82521], [-161.929775, -85.138731], [-158.07138, -85.37391], [-155.192253, -85.09956], [-150.942099, -85.295517], [-148.533073, -85.609038], [-145.888918, -85.315102], [-143.107718, -85.040752], [-142.892279, -84.570497], [-146.829068, -84.531274], [-150.060732, -84.296146], [-150.902928, -83.904232], [-153.586201, -83.68869], [-153.409907, -83.23802], [-153.037759, -82.82652], [-152.665637, -82.454192], [-152.861517, -82.042692], [-154.526299, -81.768394], [-155.29018, -81.41565], [-156.83745, -81.102129], [-154.408787, -81.160937], [-152.097662, -81.004151], [-150.648293, -81.337309], [-148.865998, -81.043373], [-147.22075, -80.671045], [-146.417749, -80.337938], [-146.770286, -79.926439], [-148.062947, -79.652089], [-149.531901, -79.358205], [-151.588416, -79.299397], [-153.390322, -79.162248], [-155.329376, -79.064269], [-155.975668, -78.69194], [-157.268302, -78.378419], [-158.051768, -78.025676], [-158.365134, -76.889207], [-157.875474, -76.987238], [-156.974573, -77.300759], [-155.329376, -77.202728], [-153.742832, -77.065579], [-152.920247, -77.496664], [-151.33378, -77.398737], [-150.00195, -77.183143], [-148.748486, -76.908845], [-147.612483, -76.575738], [-146.104409, -76.47776], [-146.143528, -76.105431], [-146.496091, -75.733154], [-146.20231, -75.380411], [-144.909624, -75.204039], [-144.322037, -75.537197], [-142.794353, -75.34124], [-141.638764, -75.086475], [-140.209007, -75.06689], [-138.85759, -74.968911], [-137.5062, -74.733783], [-136.428901, -74.518241], [-135.214583, -74.302699], [-134.431194, -74.361455], [-133.745654, -74.439848], [-132.257168, -74.302699], [-130.925311, -74.479019], [-129.554284, -74.459433], [-128.242038, -74.322284], [-126.890622, -74.420263], [-125.402082, -74.518241], [-124.011496, -74.479019], [-122.562152, -74.498604], [-121.073613, -74.518241], [-119.70256, -74.479019], [-118.684145, -74.185083], [-117.469801, -74.028348], [-116.216312, -74.243891], [-115.021552, -74.067519], [-113.944331, -73.714828], [-113.297988, -74.028348], [-112.945452, -74.38104], [-112.299083, -74.714198], [-111.261059, -74.420263], [-110.066325, -74.79254], [-108.714909, -74.910103], [-107.559346, -75.184454], [-106.149148, -75.125698], [-104.876074, -74.949326], [-103.367949, -74.988497], [-102.016507, -75.125698], [-100.645531, -75.302018], [-100.1167, -74.870933], [-100.763043, -74.537826], [-101.252703, -74.185083], [-102.545337, -74.106742], [-103.113313, -73.734413], [-103.328752, -73.362084], [-103.681289, -72.61753], [-102.917485, -72.754679], [-101.60524, -72.813436], [-100.312528, -72.754679], [-99.13738, -72.911414], [-98.118889, -73.20535], [-97.688037, -73.558041], [-96.336595, -73.616849], [-95.043961, -73.4797], [-93.672907, -73.283743], [-92.439003, -73.166179], [-91.420564, -73.401307], [-90.088733, -73.322914], [-89.226951, -72.558722], [-88.423951, -73.009393], [-87.268337, -73.185764], [-86.014822, -73.087786], [-85.192236, -73.4797], [-83.879991, -73.518871], [-82.665646, -73.636434], [-81.470913, -73.851977], [-80.687447, -73.4797], [-80.295791, -73.126956], [-79.296886, -73.518871], [-77.925858, -73.420892], [-76.907367, -73.636434], [-76.221879, -73.969541], [-74.890049, -73.871614], [-73.852024, -73.65602], [-72.833533, -73.401307], [-71.619215, -73.264157], [-70.209042, -73.146542], [-68.935916, -73.009393], [-67.956622, -72.79385], [-67.369061, -72.480329], [-67.134036, -72.049244], [-67.251548, -71.637745], [-67.56494, -71.245831], [-67.917477, -70.853917], [-68.230843, -70.462055], [-68.485452, -70.109311], [-68.544209, -69.717397], [-68.446282, -69.325535], [-67.976233, -68.953206], [-67.5845, -68.541707], [-67.427843, -68.149844], [-67.62367, -67.718759], [-67.741183, -67.326845], [-67.251548, -66.876175], [-66.703184, -66.58224], [-66.056815, -66.209963], [-65.371327, -65.89639], [-64.568276, -65.602506], [-64.176542, -65.171423], [-63.628152, -64.897073], [-63.001394, -64.642308], [-62.041686, -64.583552], [-61.414928, -64.270031], [-60.709855, -64.074074], [-59.887269, -63.95651], [-59.162585, -63.701745], [-58.594557, -63.388224], [-57.811143, -63.27066], [-57.223582, -63.525425], [-57.59573, -63.858532], [-58.614143, -64.152467]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-74.66253, -55.61183, -65.05, -52.5183], geometry: { type: "Polygon", coordinates: [[[-67.75, -53.85], [-66.45, -54.45], [-65.05, -54.7], [-65.5, -55.2], [-66.45, -55.25], [-66.95992, -54.89681], [-67.29103, -55.30124], [-68.14863, -55.61183], [-69.2321, -55.49906], [-69.95809, -55.19843], [-71.00568, -55.05383], [-72.2639, -54.49514], [-73.2852, -53.95752], [-74.66253, -52.83749], [-73.8381, -53.04743], [-72.43418, -53.7154], [-71.10773, -54.07433], [-70.59178, -53.61583], [-70.26748, -52.93123], [-69.34565, -52.5183], [-68.63411, -52.63625], [-68.63401, -52.63637], [-68.25, -53.1], [-67.75, -53.85]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0.5 }, bbox: [-61.2, -52.3, -57.75, -51.1], geometry: { type: "Polygon", coordinates: [[[-58.55, -51.1], [-57.75, -51.55], [-58.05, -51.9], [-59.4, -52.2], [-59.85, -51.85], [-60.7, -52.3], [-61.2, -51.85], [-60, -51.25], [-59.15, -51.5], [-58.55, -51.1]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0.5 }, bbox: [68.72, -49.775, 70.56, -48.625], geometry: { type: "Polygon", coordinates: [[[70.28, -49.71], [68.745, -49.775], [68.72, -49.2425], [68.8675, -48.83], [68.935, -48.625], [69.58, -48.94], [70.525, -49.065], [70.56, -49.255], [70.28, -49.71]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [144.718071, -43.634597, 148.359865, -40.703975], geometry: { type: "Polygon", coordinates: [[[145.397978, -40.792549], [146.364121, -41.137695], [146.908584, -41.000546], [147.689259, -40.808258], [148.289068, -40.875438], [148.359865, -42.062445], [148.017301, -42.407024], [147.914052, -43.211522], [147.564564, -42.937689], [146.870343, -43.634597], [146.663327, -43.580854], [146.048378, -43.549745], [145.43193, -42.693776], [145.29509, -42.03361], [144.718071, -41.162552], [144.743755, -40.703975], [145.397978, -40.792549]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [166.509144, -46.641235, 174.248517, -40.493962], geometry: { type: "Polygon", coordinates: [[[173.020375, -40.919052], [173.247234, -41.331999], [173.958405, -40.926701], [174.247587, -41.349155], [174.248517, -41.770008], [173.876447, -42.233184], [173.22274, -42.970038], [172.711246, -43.372288], [173.080113, -43.853344], [172.308584, -43.865694], [171.452925, -44.242519], [171.185138, -44.897104], [170.616697, -45.908929], [169.831422, -46.355775], [169.332331, -46.641235], [168.411354, -46.619945], [167.763745, -46.290197], [166.676886, -46.219917], [166.509144, -45.852705], [167.046424, -45.110941], [168.303763, -44.123973], [168.949409, -43.935819], [169.667815, -43.555326], [170.52492, -43.031688], [171.12509, -42.512754], [171.569714, -41.767424], [171.948709, -41.514417], [172.097227, -40.956104], [172.79858, -40.493962], [173.020375, -40.919052]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [172.636005, -41.688308, 178.517094, -34.450662], geometry: { type: "Polygon", coordinates: [[[174.612009, -36.156397], [175.336616, -37.209098], [175.357596, -36.526194], [175.808887, -36.798942], [175.95849, -37.555382], [176.763195, -37.881253], [177.438813, -37.961248], [178.010354, -37.579825], [178.517094, -37.695373], [178.274731, -38.582813], [177.97046, -39.166343], [177.206993, -39.145776], [176.939981, -39.449736], [177.032946, -39.879943], [176.885824, -40.065978], [176.508017, -40.604808], [176.01244, -41.289624], [175.239567, -41.688308], [175.067898, -41.425895], [174.650973, -41.281821], [175.22763, -40.459236], [174.900157, -39.908933], [173.824047, -39.508854], [173.852262, -39.146602], [174.574802, -38.797683], [174.743474, -38.027808], [174.697017, -37.381129], [174.292028, -36.711092], [174.319004, -36.534824], [173.840997, -36.121981], [173.054171, -35.237125], [172.636005, -34.529107], [173.007042, -34.450662], [173.551298, -35.006183], [174.32939, -35.265496], [174.612009, -36.156397]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [164.029606, -22.399976, 167.120011, -20.105646], geometry: { type: "Polygon", coordinates: [[[167.120011, -22.159991], [166.740035, -22.399976], [166.189732, -22.129708], [165.474375, -21.679607], [164.829815, -21.14982], [164.167995, -20.444747], [164.029606, -20.105646], [164.459967, -20.120012], [165.020036, -20.459991], [165.460009, -20.800022], [165.77999, -21.080005], [166.599991, -21.700019], [167.120011, -22.159991]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0.5 }, bbox: [177.28504, -18.28799, 178.71806, -17.33992], geometry: { type: "Polygon", coordinates: [[[178.3736, -17.33992], [178.71806, -17.62846], [178.55271, -18.15059], [177.93266, -18.28799], [177.38146, -18.16432], [177.28504, -17.72465], [177.67087, -17.38114], [178.12557, -17.50481], [178.3736, -17.33992]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [178.596839, -17.012042, 180, -16.067133], geometry: { type: "Polygon", coordinates: [[[179.364143, -16.801354], [178.725059, -17.012042], [178.596839, -16.63915], [179.096609, -16.433984], [179.413509, -16.379054], [180, -16.067133], [180, -16.555217], [179.364143, -16.801354]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [-180, -16.555217, -179.79332, -16.020882], geometry: { type: "Polygon", coordinates: [[[-179.917369, -16.501783], [-180, -16.555217], [-180, -16.067133], [-179.79332, -16.020882], [-179.917369, -16.501783]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [167.180008, -16.59785, 167.844877, -15.891846], geometry: { type: "Polygon", coordinates: [[[167.844877, -16.466333], [167.515181, -16.59785], [167.180008, -16.159995], [167.216801, -15.891846], [167.844877, -16.466333]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [166.629137, -15.740021, 167.270028, -14.626497], geometry: { type: "Polygon", coordinates: [[[167.107712, -14.93392], [167.270028, -15.740021], [167.001207, -15.614602], [166.793158, -15.668811], [166.649859, -15.392704], [166.629137, -14.626497], [167.107712, -14.93392]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [43.254187, -25.601434, 50.476537, -12.040557], geometry: { type: "Polygon", coordinates: [[[50.056511, -13.555761], [50.217431, -14.758789], [50.476537, -15.226512], [50.377111, -15.706069], [50.200275, -16.000263], [49.860606, -15.414253], [49.672607, -15.710204], [49.863344, -16.451037], [49.774564, -16.875042], [49.498612, -17.106036], [49.435619, -17.953064], [49.041792, -19.118781], [48.548541, -20.496888], [47.930749, -22.391501], [47.547723, -23.781959], [47.095761, -24.94163], [46.282478, -25.178463], [45.409508, -25.601434], [44.833574, -25.346101], [44.03972, -24.988345], [43.763768, -24.460677], [43.697778, -23.574116], [43.345654, -22.776904], [43.254187, -22.057413], [43.433298, -21.336475], [43.893683, -21.163307], [43.89637, -20.830459], [44.374325, -20.072366], [44.464397, -19.435454], [44.232422, -18.961995], [44.042976, -18.331387], [43.963084, -17.409945], [44.312469, -16.850496], [44.446517, -16.216219], [44.944937, -16.179374], [45.502732, -15.974373], [45.872994, -15.793454], [46.312243, -15.780018], [46.882183, -15.210182], [47.70513, -14.594303], [48.005215, -14.091233], [47.869047, -13.663869], [48.293828, -13.784068], [48.84506, -13.089175], [48.863509, -12.487868], [49.194651, -12.040557], [49.543519, -12.469833], [49.808981, -12.895285], [50.056511, -13.555761]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [113.338953, -39.035757, 153.569469, -10.668186], geometry: { type: "Polygon", coordinates: [[[143.561811, -13.763656], [143.922099, -14.548311], [144.563714, -14.171176], [144.894908, -14.594458], [145.374724, -14.984976], [145.271991, -15.428205], [145.48526, -16.285672], [145.637033, -16.784918], [145.888904, -16.906926], [146.160309, -17.761655], [146.063674, -18.280073], [146.387478, -18.958274], [147.471082, -19.480723], [148.177602, -19.955939], [148.848414, -20.39121], [148.717465, -20.633469], [149.28942, -21.260511], [149.678337, -22.342512], [150.077382, -22.122784], [150.482939, -22.556142], [150.727265, -22.402405], [150.899554, -23.462237], [151.609175, -24.076256], [152.07354, -24.457887], [152.855197, -25.267501], [153.136162, -26.071173], [153.161949, -26.641319], [153.092909, -27.2603], [153.569469, -28.110067], [153.512108, -28.995077], [153.339095, -29.458202], [153.069241, -30.35024], [153.089602, -30.923642], [152.891578, -31.640446], [152.450002, -32.550003], [151.709117, -33.041342], [151.343972, -33.816023], [151.010555, -34.31036], [150.714139, -35.17346], [150.32822, -35.671879], [150.075212, -36.420206], [149.946124, -37.109052], [149.997284, -37.425261], [149.423882, -37.772681], [148.304622, -37.809061], [147.381733, -38.219217], [146.922123, -38.606532], [146.317922, -39.035757], [145.489652, -38.593768], [144.876976, -38.417448], [145.032212, -37.896188], [144.485682, -38.085324], [143.609974, -38.809465], [142.745427, -38.538268], [142.17833, -38.380034], [141.606582, -38.308514], [140.638579, -38.019333], [139.992158, -37.402936], [139.806588, -36.643603], [139.574148, -36.138362], [139.082808, -35.732754], [138.120748, -35.612296], [138.449462, -35.127261], [138.207564, -34.384723], [137.71917, -35.076825], [136.829406, -35.260535], [137.352371, -34.707339], [137.503886, -34.130268], [137.890116, -33.640479], [137.810328, -32.900007], [136.996837, -33.752771], [136.372069, -34.094766], [135.989043, -34.890118], [135.208213, -34.47867], [135.239218, -33.947953], [134.613417, -33.222778], [134.085904, -32.848072], [134.273903, -32.617234], [132.990777, -32.011224], [132.288081, -31.982647], [131.326331, -31.495803], [129.535794, -31.590423], [128.240938, -31.948489], [127.102867, -32.282267], [126.148714, -32.215966], [125.088623, -32.728751], [124.221648, -32.959487], [124.028947, -33.483847], [123.659667, -33.890179], [122.811036, -33.914467], [122.183064, -34.003402], [121.299191, -33.821036], [120.580268, -33.930177], [119.893695, -33.976065], [119.298899, -34.509366], [119.007341, -34.464149], [118.505718, -34.746819], [118.024972, -35.064733], [117.295507, -35.025459], [116.625109, -35.025097], [115.564347, -34.386428], [115.026809, -34.196517], [115.048616, -33.623425], [115.545123, -33.487258], [115.714674, -33.259572], [115.679379, -32.900369], [115.801645, -32.205062], [115.689611, -31.612437], [115.160909, -30.601594], [114.997043, -30.030725], [115.040038, -29.461095], [114.641974, -28.810231], [114.616498, -28.516399], [114.173579, -28.118077], [114.048884, -27.334765], [113.477498, -26.543134], [113.338953, -26.116545], [113.778358, -26.549025], [113.440962, -25.621278], [113.936901, -25.911235], [114.232852, -26.298446], [114.216161, -25.786281], [113.721255, -24.998939], [113.625344, -24.683971], [113.393523, -24.384764], [113.502044, -23.80635], [113.706993, -23.560215], [113.843418, -23.059987], [113.736552, -22.475475], [114.149756, -21.755881], [114.225307, -22.517488], [114.647762, -21.82952], [115.460167, -21.495173], [115.947373, -21.068688], [116.711615, -20.701682], [117.166316, -20.623599], [117.441545, -20.746899], [118.229559, -20.374208], [118.836085, -20.263311], [118.987807, -20.044203], [119.252494, -19.952942], [119.805225, -19.976506], [120.85622, -19.683708], [121.399856, -19.239756], [121.655138, -18.705318], [122.241665, -18.197649], [122.286624, -17.798603], [122.312772, -17.254967], [123.012574, -16.4052], [123.433789, -17.268558], [123.859345, -17.069035], [123.503242, -16.596506], [123.817073, -16.111316], [124.258287, -16.327944], [124.379726, -15.56706], [124.926153, -15.0751], [125.167275, -14.680396], [125.670087, -14.51007], [125.685796, -14.230656], [126.125149, -14.347341], [126.142823, -14.095987], [126.582589, -13.952791], [127.065867, -13.817968], [127.804633, -14.276906], [128.35969, -14.86917], [128.985543, -14.875991], [129.621473, -14.969784], [129.4096, -14.42067], [129.888641, -13.618703], [130.339466, -13.357376], [130.183506, -13.10752], [130.617795, -12.536392], [131.223495, -12.183649], [131.735091, -12.302453], [132.575298, -12.114041], [132.557212, -11.603012], [131.824698, -11.273782], [132.357224, -11.128519], [133.019561, -11.376411], [133.550846, -11.786515], [134.393068, -12.042365], [134.678632, -11.941183], [135.298491, -12.248606], [135.882693, -11.962267], [136.258381, -12.049342], [136.492475, -11.857209], [136.95162, -12.351959], [136.685125, -12.887223], [136.305407, -13.29123], [135.961758, -13.324509], [136.077617, -13.724278], [135.783836, -14.223989], [135.428664, -14.715432], [135.500184, -14.997741], [136.295175, -15.550265], [137.06536, -15.870762], [137.580471, -16.215082], [138.303217, -16.807604], [138.585164, -16.806622], [139.108543, -17.062679], [139.260575, -17.371601], [140.215245, -17.710805], [140.875463, -17.369069], [141.07111, -16.832047], [141.274095, -16.38887], [141.398222, -15.840532], [141.702183, -15.044921], [141.56338, -14.561333], [141.63552, -14.270395], [141.519869, -13.698078], [141.65092, -12.944688], [141.842691, -12.741548], [141.68699, -12.407614], [141.928629, -11.877466], [142.118488, -11.328042], [142.143706, -11.042737], [142.51526, -10.668186], [142.79731, -11.157355], [142.866763, -11.784707], [143.115947, -11.90563], [143.158632, -12.325656], [143.522124, -12.834358], [143.597158, -13.400422], [143.561811, -13.763656]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [161.319797, -10.826367, 162.398646, -10.204751], geometry: { type: "Polygon", coordinates: [[[162.119025, -10.482719], [162.398646, -10.826367], [161.700032, -10.820011], [161.319797, -10.204751], [161.917383, -10.446701], [162.119025, -10.482719]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [118.967808, -10.25865, 120.775502, -9.36134], geometry: { type: "Polygon", coordinates: [[[120.715609, -10.239581], [120.295014, -10.25865], [118.967808, -9.557969], [119.90031, -9.36134], [120.425756, -9.665921], [120.775502, -9.969675], [120.715609, -10.239581]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [159.640003, -9.89521, 160.852229, -9.24295], geometry: { type: "Polygon", coordinates: [[[160.852229, -9.872937], [160.462588, -9.89521], [159.849447, -9.794027], [159.640003, -9.63998], [159.702945, -9.24295], [160.362956, -9.400304], [160.688518, -9.610162], [160.852229, -9.872937]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [160.579997, -9.784312, 161.679982, -8.320009], geometry: { type: "Polygon", coordinates: [[[161.679982, -9.599982], [161.529397, -9.784312], [160.788253, -8.917543], [160.579997, -8.320009], [160.920028, -8.320009], [161.280006, -9.120011], [161.679982, -9.599982]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [123.459989, -10.359987, 127.335928, -8.273345], geometry: { type: "Polygon", coordinates: [[[124.43595, -10.140001], [123.579982, -10.359987], [123.459989, -10.239995], [123.550009, -9.900016], [123.980009, -9.290027], [124.968682, -8.89279], [125.086246, -8.656887], [125.947072, -8.432095], [126.644704, -8.398247], [126.957243, -8.273345], [127.335928, -8.397317], [126.967992, -8.668256], [125.925885, -9.106007], [125.08852, -9.393173], [124.43595, -10.140001]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [116.740141, -9.040895, 119.126507, -8.095681], geometry: { type: "Polygon", coordinates: [[[117.900018, -8.095681], [118.260616, -8.362383], [118.87846, -8.280683], [119.126507, -8.705825], [117.970402, -8.906639], [117.277731, -9.040895], [116.740141, -9.032937], [117.083737, -8.457158], [117.632024, -8.449303], [117.900018, -8.095681]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [119.920929, -8.933666, 122.903537, -8.094234], geometry: { type: "Polygon", coordinates: [[[122.903537, -8.094234], [122.756983, -8.649808], [121.254491, -8.933666], [119.924391, -8.810418], [119.920929, -8.444859], [120.715092, -8.236965], [121.341669, -8.53674], [122.007365, -8.46062], [122.903537, -8.094234]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [158.21115, -8.53829, 159.917402, -7.320018], geometry: { type: "Polygon", coordinates: [[[159.875027, -8.33732], [159.917402, -8.53829], [159.133677, -8.114181], [158.586114, -7.754824], [158.21115, -7.421872], [158.359978, -7.320018], [158.820001, -7.560003], [159.640003, -8.020027], [159.875027, -8.33732]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [156.491358, -7.404767, 157.538426, -6.599338], geometry: { type: "Polygon", coordinates: [[[157.538426, -7.34782], [157.33942, -7.404767], [156.90203, -7.176874], [156.491358, -6.765943], [156.542828, -6.599338], [157.14, -7.021638], [157.538426, -7.34782]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [105.365486, -8.751817, 115.705527, -5.895919], geometry: { type: "Polygon", coordinates: [[[108.623479, -6.777674], [110.539227, -6.877358], [110.759576, -6.465186], [112.614811, -6.946036], [112.978768, -7.594213], [114.478935, -7.776528], [115.705527, -8.370807], [114.564511, -8.751817], [113.464734, -8.348947], [112.559672, -8.376181], [111.522061, -8.302129], [110.58615, -8.122605], [109.427667, -7.740664], [108.693655, -7.6416], [108.277763, -7.766657], [106.454102, -7.3549], [106.280624, -6.9249], [105.365486, -6.851416], [106.051646, -5.895919], [107.265009, -5.954985], [108.072091, -6.345762], [108.486846, -6.421985], [108.623479, -6.777674]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [134.112776, -6.895238, 134.727002, -5.445042], geometry: { type: "Polygon", coordinates: [[[134.724624, -6.214401], [134.210134, -6.895238], [134.112776, -6.142467], [134.290336, -5.783058], [134.499625, -5.445042], [134.727002, -5.737582], [134.724624, -6.214401]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [154.514114, -6.919991, 156.019965, -5.042431], geometry: { type: "Polygon", coordinates: [[[155.880026, -6.819997], [155.599991, -6.919991], [155.166994, -6.535931], [154.729192, -5.900828], [154.514114, -5.139118], [154.652504, -5.042431], [154.759991, -5.339984], [155.062918, -5.566792], [155.547746, -6.200655], [156.019965, -6.540014], [155.880026, -6.819997]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [148.318937, -6.317754, 152.338743, -4.14879], geometry: { type: "Polygon", coordinates: [[[151.982796, -5.478063], [151.459107, -5.56028], [151.30139, -5.840728], [150.754447, -6.083763], [150.241197, -6.317754], [149.709963, -6.316513], [148.890065, -6.02604], [148.318937, -5.747142], [148.401826, -5.437756], [149.298412, -5.583742], [149.845562, -5.505503], [149.99625, -5.026101], [150.139756, -5.001348], [150.236908, -5.53222], [150.807467, -5.455842], [151.089672, -5.113693], [151.647881, -4.757074], [151.537862, -4.167807], [152.136792, -4.14879], [152.338743, -4.312966], [152.318693, -4.867661], [151.982796, -5.478063]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [125.989034, -3.790983, 127.249215, -3.129318], geometry: { type: "Polygon", coordinates: [[[127.249215, -3.459065], [126.874923, -3.790983], [126.183802, -3.607376], [125.989034, -3.177273], [127.000651, -3.129318], [127.249215, -3.459065]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [127.898891, -3.858472, 130.834836, -2.802154], geometry: { type: "Polygon", coordinates: [[[130.471344, -3.093764], [130.834836, -3.858472], [129.990547, -3.446301], [129.155249, -3.362637], [128.590684, -3.428679], [127.898891, -3.393436], [128.135879, -2.84365], [129.370998, -2.802154], [130.471344, -3.093764]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [150.66205, -4.766427, 153.140038, -2.500002], geometry: { type: "Polygon", coordinates: [[[153.140038, -4.499983], [152.827292, -4.766427], [152.638673, -4.176127], [152.406026, -3.789743], [151.953237, -3.462062], [151.384279, -3.035422], [150.66205, -2.741486], [150.939965, -2.500002], [151.479984, -2.779985], [151.820015, -2.999972], [152.239989, -3.240009], [152.640017, -3.659983], [153.019994, -3.980015], [153.140038, -4.499983]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [130.519558, -10.652476, 150.801628, -0.369538], geometry: { type: "Polygon", coordinates: [[[134.143368, -1.151867], [134.422627, -2.769185], [135.457603, -3.367753], [136.293314, -2.307042], [137.440738, -1.703513], [138.329727, -1.702686], [139.184921, -2.051296], [139.926684, -2.409052], [141.00021, -2.600151], [142.735247, -3.289153], [144.583971, -3.861418], [145.27318, -4.373738], [145.829786, -4.876498], [145.981922, -5.465609], [147.648073, -6.083659], [147.891108, -6.614015], [146.970905, -6.721657], [147.191874, -7.388024], [148.084636, -8.044108], [148.734105, -9.104664], [149.306835, -9.071436], [149.266631, -9.514406], [150.038728, -9.684318], [149.738798, -9.872937], [150.801628, -10.293687], [150.690575, -10.582713], [150.028393, -10.652476], [149.78231, -10.393267], [148.923138, -10.280923], [147.913018, -10.130441], [147.135443, -9.492444], [146.567881, -8.942555], [146.048481, -8.067414], [144.744168, -7.630128], [143.897088, -7.91533], [143.286376, -8.245491], [143.413913, -8.983069], [142.628431, -9.326821], [142.068259, -9.159596], [141.033852, -9.117893], [140.143415, -8.297168], [139.127767, -8.096043], [138.881477, -8.380935], [137.614474, -8.411683], [138.039099, -7.597882], [138.668621, -7.320225], [138.407914, -6.232849], [137.92784, -5.393366], [135.98925, -4.546544], [135.164598, -4.462931], [133.66288, -3.538853], [133.367705, -4.024819], [132.983956, -4.112979], [132.756941, -3.746283], [132.753789, -3.311787], [131.989804, -2.820551], [133.066845, -2.460418], [133.780031, -2.479848], [133.696212, -2.214542], [132.232373, -2.212526], [131.836222, -1.617162], [130.94284, -1.432522], [130.519558, -0.93772], [131.867538, -0.695461], [132.380116, -0.369538], [133.985548, -0.78021], [134.143368, -1.151867]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [118.767769, -5.6734, 125.240501, 1.643259], geometry: { type: "Polygon", coordinates: [[[125.240501, 1.419836], [124.437035, 0.427881], [123.685505, 0.235593], [122.723083, 0.431137], [121.056725, 0.381217], [120.183083, 0.237247], [120.04087, -0.519658], [120.935905, -1.408906], [121.475821, -0.955962], [123.340565, -0.615673], [123.258399, -1.076213], [122.822715, -0.930951], [122.38853, -1.516858], [121.508274, -1.904483], [122.454572, -3.186058], [122.271896, -3.5295], [123.170963, -4.683693], [123.162333, -5.340604], [122.628515, -5.634591], [122.236394, -5.282933], [122.719569, -4.464172], [121.738234, -4.851331], [121.489463, -4.574553], [121.619171, -4.188478], [120.898182, -3.602105], [120.972389, -2.627643], [120.305453, -2.931604], [120.390047, -4.097579], [120.430717, -5.528241], [119.796543, -5.6734], [119.366906, -5.379878], [119.653606, -4.459417], [119.498835, -3.494412], [119.078344, -3.487022], [118.767769, -2.801999], [119.180974, -2.147104], [119.323394, -1.353147], [119.825999, 0.154254], [120.035702, 0.566477], [120.885779, 1.309223], [121.666817, 1.013944], [122.927567, 0.875192], [124.077522, 0.917102], [125.065989, 1.643259], [125.240501, 1.419836]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [127.39949, -0.899996, 128.688249, 2.174596], geometry: { type: "Polygon", coordinates: [[[128.688249, 1.132386], [128.635952, 0.258486], [128.12017, 0.356413], [127.968034, -0.252077], [128.379999, -0.780004], [128.100016, -0.899996], [127.696475, -0.266598], [127.39949, 1.011722], [127.600512, 1.810691], [127.932378, 2.174596], [128.004156, 1.628531], [128.594559, 1.540811], [128.688249, 1.132386]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [95.293026, -5.873285, 106.108593, 5.479821], geometry: { type: "Polygon", coordinates: [[[105.817655, -5.852356], [104.710384, -5.873285], [103.868213, -5.037315], [102.584261, -4.220259], [102.156173, -3.614146], [101.399113, -2.799777], [100.902503, -2.050262], [100.141981, -0.650348], [99.26374, 0.183142], [98.970011, 1.042882], [98.601351, 1.823507], [97.699598, 2.453184], [97.176942, 3.308791], [96.424017, 3.86886], [95.380876, 4.970782], [95.293026, 5.479821], [95.936863, 5.439513], [97.484882, 5.246321], [98.369169, 4.26837], [99.142559, 3.59035], [99.693998, 3.174329], [100.641434, 2.099381], [101.658012, 2.083697], [102.498271, 1.3987], [103.07684, 0.561361], [103.838396, 0.104542], [103.437645, -0.711946], [104.010789, -1.059212], [104.369991, -1.084843], [104.53949, -1.782372], [104.887893, -2.340425], [105.622111, -2.428844], [106.108593, -3.061777], [105.857446, -4.305525], [105.817655, -5.852356]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [108.952658, -4.106984, 119.181904, 6.928053], geometry: { type: "Polygon", coordinates: [[[117.875627, 1.827641], [118.996747, 0.902219], [117.811858, 0.784242], [117.478339, 0.102475], [117.521644, -0.803723], [116.560048, -1.487661], [116.533797, -2.483517], [116.148084, -4.012726], [116.000858, -3.657037], [114.864803, -4.106984], [114.468652, -3.495704], [113.755672, -3.43917], [113.256994, -3.118776], [112.068126, -3.478392], [111.703291, -2.994442], [111.04824, -3.049426], [110.223846, -2.934032], [110.070936, -1.592874], [109.571948, -1.314907], [109.091874, -0.459507], [108.952658, 0.415375], [109.069136, 1.341934], [109.66326, 2.006467], [110.396135, 1.663775], [111.168853, 1.850637], [111.370081, 2.697303], [111.796928, 2.885897], [112.995615, 3.102395], [113.712935, 3.893509], [114.204017, 4.525874], [114.599961, 4.900011], [115.45071, 5.44773], [116.220741, 6.143191], [116.725103, 6.924771], [117.129626, 6.928053], [117.643393, 6.422166], [117.689075, 5.98749], [118.347691, 5.708696], [119.181904, 5.407836], [119.110694, 5.016128], [118.439727, 4.966519], [118.618321, 4.478202], [117.882035, 4.137551], [117.313232, 3.234428], [118.04833, 2.28769], [117.875627, 1.827641]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [121.919928, 5.581003, 126.537424, 9.760335], geometry: { type: "Polygon", coordinates: [[[126.376814, 8.414706], [126.478513, 7.750354], [126.537424, 7.189381], [126.196773, 6.274294], [125.831421, 7.293715], [125.363852, 6.786485], [125.683161, 6.049657], [125.396512, 5.581003], [124.219788, 6.161355], [123.93872, 6.885136], [124.243662, 7.36061], [123.610212, 7.833527], [123.296071, 7.418876], [122.825506, 7.457375], [122.085499, 6.899424], [121.919928, 7.192119], [122.312359, 8.034962], [122.942398, 8.316237], [123.487688, 8.69301], [123.841154, 8.240324], [124.60147, 8.514158], [124.764612, 8.960409], [125.471391, 8.986997], [125.412118, 9.760335], [126.222714, 9.286074], [126.306637, 8.782487], [126.376814, 8.414706]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [79.695167, 5.96837, 81.787959, 9.824078], geometry: { type: "Polygon", coordinates: [[[81.21802, 6.197141], [80.348357, 5.96837], [79.872469, 6.763463], [79.695167, 8.200843], [80.147801, 9.824078], [80.838818, 9.268427], [81.304319, 8.564206], [81.787959, 7.523055], [81.637322, 6.481775], [81.21802, 6.197141]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [-61.95, 10, -60.895, 10.89], geometry: { type: "Polygon", coordinates: [[[-60.935, 10.11], [-61.77, 10], [-61.95, 10.09], [-61.66, 10.365], [-61.68, 10.76], [-61.105, 10.89], [-60.895, 10.855], [-60.935, 10.11]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [122.380055, 9.022189, 124.077936, 11.232726], geometry: { type: "Polygon", coordinates: [[[123.982438, 10.278779], [123.623183, 9.950091], [123.309921, 9.318269], [122.995883, 9.022189], [122.380055, 9.713361], [122.586089, 9.981045], [122.837081, 10.261157], [122.947411, 10.881868], [123.49885, 10.940624], [123.337774, 10.267384], [124.077936, 11.232726], [123.982438, 10.278779]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [117.174275, 8.3675, 119.689677, 11.369668], geometry: { type: "Polygon", coordinates: [[[118.504581, 9.316383], [117.174275, 8.3675], [117.664477, 9.066889], [118.386914, 9.6845], [118.987342, 10.376292], [119.511496, 11.369668], [119.689677, 10.554291], [119.029458, 10.003653], [118.504581, 9.316383]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [121.883548, 10.441017, 123.120217, 11.891755], geometry: { type: "Polygon", coordinates: [[[121.883548, 11.891755], [122.483821, 11.582187], [123.120217, 11.58366], [123.100838, 11.165934], [122.637714, 10.741308], [122.00261, 10.441017], [121.967367, 10.905691], [122.03837, 11.415841], [121.883548, 11.891755]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [124.266762, 10.134679, 125.783465, 12.557761], geometry: { type: "Polygon", coordinates: [[[125.502552, 12.162695], [125.783465, 11.046122], [125.011884, 11.311455], [125.032761, 10.975816], [125.277449, 10.358722], [124.801819, 10.134679], [124.760168, 10.837995], [124.459101, 10.88993], [124.302522, 11.495371], [124.891013, 11.415583], [124.87799, 11.79419], [124.266762, 12.557761], [125.227116, 12.535721], [125.502552, 12.162695]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [120.323436, 12.20556, 121.527394, 13.466413], geometry: { type: "Polygon", coordinates: [[[121.527394, 13.06959], [121.26219, 12.20556], [120.833896, 12.704496], [120.323436, 13.466413], [121.180128, 13.429697], [121.527394, 13.06959]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [119.883773, 12.536677, 124.181289, 18.505227], geometry: { type: "Polygon", coordinates: [[[121.321308, 18.504065], [121.937601, 18.218552], [122.246006, 18.47895], [122.336957, 18.224883], [122.174279, 17.810283], [122.515654, 17.093505], [122.252311, 16.262444], [121.662786, 15.931018], [121.50507, 15.124814], [121.728829, 14.328376], [122.258925, 14.218202], [122.701276, 14.336541], [123.950295, 13.782131], [123.855107, 13.237771], [124.181289, 12.997527], [124.077419, 12.536677], [123.298035, 13.027526], [122.928652, 13.55292], [122.671355, 13.185836], [122.03465, 13.784482], [121.126385, 13.636687], [120.628637, 13.857656], [120.679384, 14.271016], [120.991819, 14.525393], [120.693336, 14.756671], [120.564145, 14.396279], [120.070429, 14.970869], [119.920929, 15.406347], [119.883773, 16.363704], [120.286488, 16.034629], [120.390047, 17.599081], [120.715867, 18.505227], [121.321308, 18.504065]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-67.242428, 17.946553, -65.591004, 18.520601], geometry: { type: "Polygon", coordinates: [[[-65.591004, 18.228035], [-65.847164, 17.975906], [-66.599934, 17.981823], [-67.184162, 17.946553], [-67.242428, 18.37446], [-67.100679, 18.520601], [-66.282434, 18.514762], [-65.771303, 18.426679], [-65.591004, 18.228035]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-78.337719, 17.701116, -76.199659, 18.524218], geometry: { type: "Polygon", coordinates: [[[-76.902561, 17.868238], [-77.206341, 17.701116], [-77.766023, 17.861597], [-78.337719, 18.225968], [-78.217727, 18.454533], [-77.797365, 18.524218], [-77.569601, 18.490525], [-76.896619, 18.400867], [-76.365359, 18.160701], [-76.199659, 17.886867], [-76.902561, 17.868238]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-74.458034, 17.598564, -68.317943, 19.915684], geometry: { type: "Polygon", coordinates: [[[-72.579673, 19.871501], [-71.712361, 19.714456], [-71.587304, 19.884911], [-70.806706, 19.880286], [-70.214365, 19.622885], [-69.950815, 19.648], [-69.76925, 19.293267], [-69.222126, 19.313214], [-69.254346, 19.015196], [-68.809412, 18.979074], [-68.317943, 18.612198], [-68.689316, 18.205142], [-69.164946, 18.422648], [-69.623988, 18.380713], [-69.952934, 18.428307], [-70.133233, 18.245915], [-70.517137, 18.184291], [-70.669298, 18.426886], [-70.99995, 18.283329], [-71.40021, 17.598564], [-71.657662, 17.757573], [-71.708305, 18.044997], [-72.372476, 18.214961], [-72.844411, 18.145611], [-73.454555, 18.217906], [-73.922433, 18.030993], [-74.458034, 18.34255], [-74.369925, 18.664908], [-73.449542, 18.526053], [-72.694937, 18.445799], [-72.334882, 18.668422], [-72.79165, 19.101625], [-72.784105, 19.483591], [-73.415022, 19.639551], [-73.189791, 19.915684], [-72.579673, 19.871501]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [108.626217, 18.197701, 111.010051, 20.101254], geometry: { type: "Polygon", coordinates: [[[110.339188, 18.678395], [109.47521, 18.197701], [108.655208, 18.507682], [108.626217, 19.367888], [109.119056, 19.821039], [110.211599, 20.101254], [110.786551, 20.077534], [111.010051, 19.69593], [110.570647, 19.255879], [110.339188, 18.678395]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0.5 }, bbox: [-156.07347, 18.91619, -154.80741, 20.26721], geometry: { type: "Polygon", coordinates: [[[-155.54211, 19.08348], [-155.68817, 18.91619], [-155.93665, 19.05939], [-155.90806, 19.33888], [-156.07347, 19.70294], [-156.02368, 19.81422], [-155.85008, 19.97729], [-155.91907, 20.17395], [-155.86108, 20.26721], [-155.78505, 20.2487], [-155.40214, 20.07975], [-155.22452, 19.99302], [-155.06226, 19.8591], [-154.80741, 19.50871], [-154.83147, 19.45328], [-155.22217, 19.23972], [-155.54211, 19.08348]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-156.71055, 20.57241, -155.99566, 21.01249], geometry: { type: "Polygon", coordinates: [[[-156.07926, 20.64397], [-156.41445, 20.57241], [-156.58673, 20.783], [-156.70167, 20.8643], [-156.71055, 20.92676], [-156.61258, 21.01249], [-156.25711, 20.91745], [-155.99566, 20.76404], [-156.07926, 20.64397]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-157.32521, 21.06873, -156.75824, 21.21958], geometry: { type: "Polygon", coordinates: [[[-156.75824, 21.17684], [-156.78933, 21.06873], [-157.32521, 21.09777], [-157.25027, 21.21958], [-156.75824, 21.17684]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [-158.29265, 21.26442, -157.65283, 21.71696], geometry: { type: "Polygon", coordinates: [[[-157.65283, 21.32217], [-157.70703, 21.26442], [-157.7786, 21.27729], [-158.12667, 21.31244], [-158.2538, 21.53919], [-158.29265, 21.57912], [-158.0252, 21.71696], [-157.94161, 21.65272], [-157.65283, 21.32217]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-159.80051, 21.88299, -159.34512, 22.23618], geometry: { type: "Polygon", coordinates: [[[-159.34512, 21.982], [-159.46372, 21.88299], [-159.80051, 22.06533], [-159.74877, 22.1382], [-159.5962, 22.23618], [-159.36569, 22.21494], [-159.34512, 21.982]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-84.974911, 19.855481, -74.178025, 23.188611], geometry: { type: "Polygon", coordinates: [[[-79.679524, 22.765303], [-79.281486, 22.399202], [-78.347434, 22.512166], [-77.993296, 22.277194], [-77.146422, 21.657851], [-76.523825, 21.20682], [-76.19462, 21.220565], [-75.598222, 21.016624], [-75.67106, 20.735091], [-74.933896, 20.693905], [-74.178025, 20.284628], [-74.296648, 20.050379], [-74.961595, 19.923435], [-75.63468, 19.873774], [-76.323656, 19.952891], [-77.755481, 19.855481], [-77.085108, 20.413354], [-77.492655, 20.673105], [-78.137292, 20.739949], [-78.482827, 21.028613], [-78.719867, 21.598114], [-79.285, 21.559175], [-80.217475, 21.827324], [-80.517535, 22.037079], [-81.820943, 22.192057], [-82.169992, 22.387109], [-81.795002, 22.636965], [-82.775898, 22.68815], [-83.494459, 22.168518], [-83.9088, 22.154565], [-84.052151, 21.910575], [-84.54703, 21.801228], [-84.974911, 21.896028], [-84.447062, 22.20495], [-84.230357, 22.565755], [-83.77824, 22.788118], [-83.267548, 22.983042], [-82.510436, 23.078747], [-82.268151, 23.188611], [-81.404457, 23.117271], [-80.618769, 23.10598], [-79.679524, 22.765303]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [-78.40848, 23.71, -77.53466, 25.2103], geometry: { type: "Polygon", coordinates: [[[-77.53466, 23.75975], [-77.78, 23.71], [-78.03405, 24.28615], [-78.40848, 24.57564], [-78.19087, 25.2103], [-77.89, 25.17], [-77.54, 24.34], [-77.53466, 23.75975]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [120.106189, 21.970571, 121.951244, 25.295459], geometry: { type: "Polygon", coordinates: [[[121.175632, 22.790857], [120.74708, 21.970571], [120.220083, 22.814861], [120.106189, 23.556263], [120.69468, 24.538451], [121.495044, 25.295459], [121.951244, 24.997596], [121.777818, 24.394274], [121.175632, 22.790857]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-78.98, 26.42, -77.82, 26.87], geometry: { type: "Polygon", coordinates: [[[-77.82, 26.58], [-78.91, 26.42], [-78.98, 26.79], [-78.51, 26.87], [-77.85, 26.84], [-77.82, 26.58]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-77.79, 25.87918, -77, 27.04], geometry: { type: "Polygon", coordinates: [[[-77, 26.59], [-77.17255, 25.87918], [-77.35641, 26.00735], [-77.34, 26.53], [-77.78802, 26.92516], [-77.79, 27.04], [-77, 26.59]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [132.363115, 32.704567, 134.766379, 34.364931], geometry: { type: "Polygon", coordinates: [[[134.638428, 34.149234], [134.766379, 33.806335], [134.203416, 33.201178], [133.79295, 33.521985], [133.280268, 33.28957], [133.014858, 32.704567], [132.363115, 32.989382], [132.371176, 33.463642], [132.924373, 34.060299], [133.492968, 33.944621], [133.904106, 34.364931], [134.638428, 34.149234]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [32.256667, 34.571869, 34.576474, 35.671596], geometry: { type: "Polygon", coordinates: [[[34.576474, 35.671596], [33.900804, 35.245756], [33.973617, 35.058506], [34.004881, 34.978098], [32.979827, 34.571869], [32.490296, 34.701655], [32.256667, 35.103232], [32.73178, 35.140026], [32.802474, 35.145504], [32.946961, 35.386703], [33.667227, 35.373216], [34.576474, 35.671596]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [23.514978, 34.919988, 26.290003, 35.705004], geometry: { type: "Polygon", coordinates: [[[23.69998, 35.705004], [24.246665, 35.368022], [25.025015, 35.424996], [25.769208, 35.354018], [25.745023, 35.179998], [26.290003, 35.29999], [26.164998, 35.004995], [24.724982, 34.919988], [24.735007, 35.084991], [23.514978, 35.279992], [23.69998, 35.705004]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [12.431004, 36.619987, 15.520376, 38.231155], geometry: { type: "Polygon", coordinates: [[[15.520376, 38.231155], [15.160243, 37.444046], [15.309898, 37.134219], [15.099988, 36.619987], [14.335229, 36.996631], [13.826733, 37.104531], [12.431004, 37.61295], [12.570944, 38.126381], [13.741156, 38.034966], [14.761249, 38.143874], [15.520376, 38.231155]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [8.159998, 38.906618, 9.809975, 41.209991], geometry: { type: "Polygon", coordinates: [[[9.210012, 41.209991], [9.809975, 40.500009], [9.669519, 39.177376], [9.214818, 39.240473], [8.806936, 38.906618], [8.428302, 39.171847], [8.388253, 40.378311], [8.159998, 40.950007], [8.709991, 40.899984], [9.210012, 41.209991]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [129.408463, 31.029579, 141.914263, 41.37856], geometry: { type: "Polygon", coordinates: [[[140.976388, 37.142074], [140.59977, 36.343983], [140.774074, 35.842877], [140.253279, 35.138114], [138.975528, 34.6676], [137.217599, 34.606286], [135.792983, 33.464805], [135.120983, 33.849071], [135.079435, 34.596545], [133.340316, 34.375938], [132.156771, 33.904933], [130.986145, 33.885761], [132.000036, 33.149992], [131.33279, 31.450355], [130.686318, 31.029579], [130.20242, 31.418238], [130.447676, 32.319475], [129.814692, 32.61031], [129.408463, 33.296056], [130.353935, 33.604151], [130.878451, 34.232743], [131.884229, 34.749714], [132.617673, 35.433393], [134.608301, 35.731618], [135.677538, 35.527134], [136.723831, 37.304984], [137.390612, 36.827391], [138.857602, 37.827485], [139.426405, 38.215962], [140.05479, 39.438807], [139.883379, 40.563312], [140.305783, 41.195005], [141.368973, 41.37856], [141.914263, 39.991616], [141.884601, 39.180865], [140.959489, 38.174001], [140.976388, 37.142074]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [8.544213, 41.380007, 9.560016, 43.009985], geometry: { type: "Polygon", coordinates: [[[9.560016, 42.152492], [9.229752, 41.380007], [8.775723, 41.583612], [8.544213, 42.256517], [8.746009, 42.628122], [9.390001, 43.009985], [9.560016, 42.152492]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [139.817544, 41.569556, 145.543137, 45.551483], geometry: { type: "Polygon", coordinates: [[[143.910162, 44.1741], [144.613427, 43.960883], [145.320825, 44.384733], [145.543137, 43.262088], [144.059662, 42.988358], [143.18385, 41.995215], [141.611491, 42.678791], [141.067286, 41.584594], [139.955106, 41.569556], [139.817544, 42.563759], [140.312087, 43.333273], [141.380549, 43.388825], [141.671952, 44.772125], [141.967645, 45.551483], [143.14287, 44.510358], [143.910162, 44.1741]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [-64.39261, 45.96818, -62.01208, 47.03601], geometry: { type: "Polygon", coordinates: [[[-63.6645, 46.55001], [-62.9393, 46.41587], [-62.01208, 46.44314], [-62.50391, 46.03339], [-62.87433, 45.96818], [-64.1428, 46.39265], [-64.39261, 46.72747], [-64.01486, 47.03601], [-63.6645, 46.55001]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [-64.51912, 49.08717, -61.806305, 49.95718], geometry: { type: "Polygon", coordinates: [[[-61.806305, 49.10506], [-62.29318, 49.08717], [-63.58926, 49.40069], [-64.51912, 49.87304], [-64.17322, 49.95718], [-62.85829, 49.70641], [-61.835585, 49.28855], [-61.806305, 49.10506]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-128.444584, 48.370846, -123.510002, 50.770648], geometry: { type: "Polygon", coordinates: [[[-123.510002, 48.510011], [-124.012891, 48.370846], [-125.655013, 48.825005], [-125.954994, 49.179996], [-126.850004, 49.53], [-127.029993, 49.814996], [-128.059336, 49.994959], [-128.444584, 50.539138], [-128.358414, 50.770648], [-127.308581, 50.552574], [-126.695001, 50.400903], [-125.755007, 50.295018], [-125.415002, 49.950001], [-124.920768, 49.475275], [-123.922509, 49.062484], [-123.510002, 48.510011]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-59.419494, 46.618292, -52.648099, 51.632094], geometry: { type: "Polygon", coordinates: [[[-56.134036, 50.68701], [-56.795882, 49.812309], [-56.143105, 50.150117], [-55.471492, 49.935815], [-55.822401, 49.587129], [-54.935143, 49.313011], [-54.473775, 49.556691], [-53.476549, 49.249139], [-53.786014, 48.516781], [-53.086134, 48.687804], [-52.958648, 48.157164], [-52.648099, 47.535548], [-53.069158, 46.655499], [-53.521456, 46.618292], [-54.178936, 46.807066], [-53.961869, 47.625207], [-54.240482, 47.752279], [-55.400773, 46.884994], [-55.997481, 46.91972], [-55.291219, 47.389562], [-56.250799, 47.632545], [-57.325229, 47.572807], [-59.266015, 47.603348], [-59.419494, 47.899454], [-58.796586, 48.251525], [-59.231625, 48.523188], [-58.391805, 49.125581], [-57.35869, 50.718274], [-56.73865, 51.287438], [-55.870977, 51.632094], [-55.406974, 51.588273], [-55.600218, 51.317075], [-56.134036, 50.68701]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-133.239664, 52.180433, -131.179043, 54.169975], geometry: { type: "Polygon", coordinates: [[[-132.710008, 54.040009], [-132.710009, 54.040009], [-132.710008, 54.040009], [-132.710008, 54.040009], [-131.74999, 54.120004], [-132.04948, 52.984621], [-131.179043, 52.180433], [-131.57783, 52.182371], [-132.180428, 52.639707], [-132.549992, 53.100015], [-133.054611, 53.411469], [-133.239664, 53.85108], [-133.180004, 54.169975], [-132.710008, 54.040009]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [141.594076, 45.966755, 144.654148, 54.365881], geometry: { type: "Polygon", coordinates: [[[143.648007, 50.7476], [144.654148, 48.976391], [143.173928, 49.306551], [142.558668, 47.861575], [143.533492, 46.836728], [143.505277, 46.137908], [142.747701, 46.740765], [142.09203, 45.966755], [141.906925, 46.805929], [142.018443, 47.780133], [141.904445, 48.859189], [142.1358, 49.615163], [142.179983, 50.952342], [141.594076, 51.935435], [141.682546, 53.301966], [142.606934, 53.762145], [142.209749, 54.225476], [142.654786, 54.365881], [142.914616, 53.704578], [143.260848, 52.74076], [143.235268, 51.75666], [143.648007, 50.7476]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-9.977086, 51.669301, -5.661949, 55.17286], geometry: { type: "Polygon", coordinates: [[[-6.788857, 52.260118], [-8.561617, 51.669301], [-9.977086, 51.820455], [-9.166283, 52.864629], [-9.688525, 53.881363], [-8.327987, 54.664519], [-7.572168, 55.131622], [-6.733847, 55.17286], [-5.661949, 54.554603], [-6.197885, 53.867565], [-6.032985, 53.153164], [-6.788857, 52.260118]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [10.903914, 54.800015, 12.690006, 56.111407], geometry: { type: "Polygon", coordinates: [[[12.690006, 55.609991], [12.089991, 54.800015], [11.043543, 55.364864], [10.903914, 55.779955], [12.370904, 56.111407], [12.690006, 55.609991]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-154.670993, 56.734677, -152.141147, 57.968968], geometry: { type: "Polygon", coordinates: [[[-153.006314, 57.115842], [-154.00509, 56.734677], [-154.516403, 56.992749], [-154.670993, 57.461196], [-153.76278, 57.816575], [-153.228729, 57.968968], [-152.564791, 57.901427], [-152.141147, 57.591059], [-153.006314, 57.115842]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-6.149981, 49.96, 1.681531, 58.635], geometry: { type: "Polygon", coordinates: [[[-3.005005, 58.635], [-4.073828, 57.553025], [-3.055002, 57.690019], [-1.959281, 57.6848], [-2.219988, 56.870017], [-3.119003, 55.973793], [-2.085009, 55.909998], [-1.114991, 54.624986], [-0.430485, 54.464376], [0.184981, 53.325014], [0.469977, 52.929999], [1.681531, 52.73952], [1.559988, 52.099998], [1.050562, 51.806761], [1.449865, 51.289428], [0.550334, 50.765739], [-0.787517, 50.774989], [-2.489998, 50.500019], [-2.956274, 50.69688], [-3.617448, 50.228356], [-4.542508, 50.341837], [-5.245023, 49.96], [-5.776567, 50.159678], [-4.30999, 51.210001], [-3.414851, 51.426009], [-4.984367, 51.593466], [-5.267296, 51.9914], [-4.222347, 52.301356], [-4.770013, 52.840005], [-4.579999, 53.495004], [-3.09208, 53.404441], [-2.945009, 53.985], [-3.630005, 54.615013], [-4.844169, 54.790971], [-5.082527, 55.061601], [-4.719112, 55.508473], [-5.047981, 55.783986], [-5.586398, 55.311146], [-5.644999, 56.275015], [-6.149981, 56.78501], [-5.786825, 57.818848], [-5.009999, 58.630013], [-4.211495, 58.550845], [-3.005005, 58.635]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-167.455277, 59.754441, -165.579164, 60.38417], geometry: { type: "Polygon", coordinates: [[[-165.579164, 59.909987], [-166.19277, 59.754441], [-166.848337, 59.941406], [-167.455277, 60.213069], [-166.467792, 60.38417], [-165.67443, 60.293607], [-165.579164, 59.909987]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-80.36215, 61.63308, -79.26582, 62.3856], geometry: { type: "Polygon", coordinates: [[[-79.26582, 62.158675], [-79.65752, 61.63308], [-80.09956, 61.7181], [-80.36215, 62.01649], [-80.315395, 62.085565], [-79.92939, 62.3856], [-79.52002, 62.36371], [-79.26582, 62.158675]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-83.99367, 62.15922, -81.87699, 62.91409], geometry: { type: "Polygon", coordinates: [[[-81.89825, 62.7108], [-83.06857, 62.15922], [-83.77462, 62.18231], [-83.99367, 62.4528], [-83.25048, 62.91409], [-81.87699, 62.90458], [-81.89825, 62.7108]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [-171.791111, 62.976931, -168.689439, 63.782515], geometry: { type: "Polygon", coordinates: [[[-171.731657, 63.782515], [-171.114434, 63.592191], [-170.491112, 63.694975], [-169.682505, 63.431116], [-168.689439, 63.297506], [-168.771941, 63.188598], [-169.52944, 62.976931], [-170.290556, 63.194438], [-170.671386, 63.375822], [-171.553063, 63.317789], [-171.791111, 63.405846], [-171.731657, 63.782515]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 0.5 }, bbox: [-87.221983, 63.052379, -80.103451, 65.738778], geometry: { type: "Polygon", coordinates: [[[-85.161308, 65.657285], [-84.975764, 65.217518], [-84.464012, 65.371772], [-83.882626, 65.109618], [-82.787577, 64.766693], [-81.642014, 64.455136], [-81.55344, 63.979609], [-80.817361, 64.057486], [-80.103451, 63.725981], [-80.99102, 63.411246], [-82.547178, 63.651722], [-83.108798, 64.101876], [-84.100417, 63.569712], [-85.523405, 63.052379], [-85.866769, 63.637253], [-87.221983, 63.541238], [-86.35276, 64.035833], [-86.224886, 64.822917], [-85.883848, 65.738778], [-85.161308, 65.657285]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-24.326184, 63.496383, -13.609732, 66.526792], geometry: { type: "Polygon", coordinates: [[[-14.508695, 66.455892], [-14.739637, 65.808748], [-13.609732, 65.126671], [-14.909834, 64.364082], [-17.794438, 63.678749], [-18.656246, 63.496383], [-19.972755, 63.643635], [-22.762972, 63.960179], [-21.778484, 64.402116], [-23.955044, 64.89113], [-22.184403, 65.084968], [-22.227423, 65.378594], [-24.326184, 65.611189], [-23.650515, 66.262519], [-22.134922, 66.410469], [-20.576284, 65.732112], [-19.056842, 66.276601], [-17.798624, 65.993853], [-16.167819, 66.526792], [-14.508695, 66.455892]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [-77.2364, 67.09873, -75.10333, 68.28721], geometry: { type: "Polygon", coordinates: [[[-75.86588, 67.14886], [-76.98687, 67.09873], [-77.2364, 67.58809], [-76.81166, 68.14856], [-75.89521, 68.28721], [-75.1145, 68.01036], [-75.10333, 67.58202], [-75.21597, 67.44425], [-75.86588, 67.14886]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-180, 64.25269, -169.89958, 68.963636], geometry: { type: "Polygon", coordinates: [[[-175.01425, 66.58435], [-174.33983, 66.33556], [-174.57182, 67.06219], [-171.85731, 66.91308], [-169.89958, 65.97724], [-170.89107, 65.54139], [-172.53025, 65.43791], [-172.555, 64.46079], [-172.95533, 64.25269], [-173.89184, 64.2826], [-174.65392, 64.63125], [-175.98353, 64.92288], [-176.20716, 65.35667], [-177.22266, 65.52024], [-178.35993, 65.39052], [-178.90332, 65.74044], [-178.68611, 66.11211], [-179.88377, 65.87456], [-179.43268, 65.40411], [-180, 64.979709], [-180, 68.963636], [-177.55, 68.2], [-174.92825, 67.20589], [-175.01425, 66.58435]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [-99.797401, 68.75704, -95.647681, 70.14354], geometry: { type: "Polygon", coordinates: [[[-95.647681, 69.10769], [-96.269521, 68.75704], [-97.617401, 69.06003], [-98.431801, 68.9507], [-99.797401, 69.40003], [-98.917401, 69.71003], [-98.218261, 70.14354], [-97.157401, 69.86003], [-96.557401, 69.68003], [-96.257401, 69.49003], [-95.647681, 69.10769]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [178.7253, 70.78114, 180, 71.515714], geometry: { type: "Polygon", coordinates: [[[180, 70.832199], [178.903425, 70.78114], [178.7253, 71.0988], [180, 71.515714], [180, 70.832199]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-180, 70.832199, -177.577945, 71.55762], geometry: { type: "Polygon", coordinates: [[[-178.69378, 70.89302], [-180, 70.832199], [-180, 71.515714], [-179.871875, 71.55762], [-179.02433, 71.55553], [-177.577945, 71.26948], [-177.663575, 71.13277], [-178.69378, 70.89302]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-168.110474, -53.856384, -34.72998, 71.920471], geometry: { type: "Polygon", coordinates: [[[-90.547119, 69.497681], [-90.551514, 68.475098], [-89.215088, 69.258728], [-88.019592, 68.615112], [-88.317505, 67.873474], [-87.350098, 67.19873], [-86.306091, 67.921509], [-85.576599, 68.784485], [-85.521912, 69.88208], [-84.100769, 69.805481], [-82.622498, 69.658325], [-81.280396, 69.162109], [-81.220215, 68.66571], [-81.964294, 68.132507], [-81.259277, 67.59729], [-81.386475, 67.110901], [-83.344482, 66.411682], [-84.735413, 66.257324], [-85.769409, 66.558289], [-86.067627, 66.056274], [-87.031372, 65.213074], [-87.323181, 64.775696], [-88.48291, 64.099121], [-89.914429, 64.032715], [-90.703979, 63.610291], [-90.77002, 62.960327], [-91.933411, 62.835083], [-93.156982, 62.024719], [-94.241516, 60.898682], [-94.629272, 60.110291], [-94.684509, 58.948914], [-93.215027, 58.782104], [-92.764587, 57.845703], [-92.296997, 57.087097], [-90.897705, 57.284729], [-89.03949, 56.851685], [-88.039795, 56.47168], [-87.324219, 55.999084], [-86.071228, 55.723877], [-85.01178, 55.302673], [-83.360474, 55.244873], [-82.272827, 55.148315], [-82.436218, 54.282288], [-82.125, 53.2771], [-81.400696, 52.157898], [-79.912903, 51.208496], [-79.143005, 51.533875], [-78.601929, 52.562073], [-79.124207, 54.141479], [-79.82959, 54.667725], [-78.228699, 55.136475], [-77.095581, 55.837524], [-76.541382, 56.534302], [-76.623108, 57.202698], [-77.302185, 58.052124], [-78.516907, 58.804688], [-77.33667, 59.852722], [-77.772705, 60.757874], [-78.106812, 62.319702], [-77.410583, 62.550476], [-75.696228, 62.278503], [-74.668213, 62.181091], [-73.839905, 62.443909], [-72.908508, 62.105103], [-71.677002, 61.52533], [-71.373718, 61.137085], [-69.590393, 61.061523], [-69.6203, 60.221313], [-69.287903, 58.957275], [-68.374512, 58.801086], [-67.64978, 58.212097], [-66.201782, 58.767273], [-65.245178, 59.870728], [-64.583496, 60.335693], [-63.804687, 59.442688], [-62.50238, 58.167114], [-61.396484, 56.967529], [-61.798584, 56.339478], [-60.468506, 55.775513], [-59.56958, 55.204102], [-57.975098, 54.945496], [-57.333191, 54.626526], [-56.93689, 53.780273], [-56.158081, 53.647522], [-55.756287, 53.270508], [-55.683289, 52.146729], [-56.40918, 51.770691], [-57.126892, 51.419678], [-58.77478, 51.06427], [-60.033081, 50.24292], [-61.723572, 50.080505], [-63.862488, 50.291077], [-65.363281, 50.298279], [-66.398987, 50.228882], [-67.236328, 49.511475], [-68.511108, 49.068481], [-69.953613, 47.744873], [-71.104492, 46.821716], [-70.255188, 46.986084], [-68.650024, 48.30011], [-66.552429, 49.133118], [-65.056213, 49.23291], [-64.171021, 48.742493], [-65.115479, 48.070923], [-64.798523, 46.993103], [-64.472107, 46.238525], [-63.173279, 45.739075], [-61.520691, 45.883911], [-60.518127, 47.007874], [-60.448608, 46.282715], [-59.802795, 45.920471], [-61.039795, 45.26532], [-63.2547, 44.670288], [-64.246582, 44.265503], [-65.364075, 43.545288], [-66.123413, 43.618713], [-66.161682, 44.465088], [-64.425476, 45.292114], [-66.026001, 45.259277], [-67.13739, 45.137512], [-66.9646, 44.809692], [-68.032471, 44.325317], [-69.059998, 43.980103], [-70.116089, 43.684082], [-70.690002, 43.03009], [-70.81488, 42.865295], [-70.825012, 42.335083], [-70.494995, 41.805115], [-70.080017, 41.78009], [-70.184998, 42.145081], [-69.884888, 41.922913], [-69.965027, 41.637085], [-70.640015, 41.475098], [-71.1203, 41.494507], [-71.859985, 41.320129], [-72.294983, 41.270081], [-72.876404, 41.220703], [-73.710022, 40.931091], [-72.241211, 41.119507], [-71.945007, 40.930115], [-73.34491, 40.630127], [-73.981995, 40.628113], [-73.952271, 40.750671], [-74.256714, 40.473511], [-73.962402, 40.427673], [-74.178406, 39.70929], [-74.906006, 38.939514], [-74.980408, 39.196472], [-75.200012, 39.248474], [-75.528076, 39.498474], [-75.320007, 38.960083], [-75.083496, 38.781311], [-75.056702, 38.404114], [-75.37738, 38.015503], [-75.940186, 37.216919], [-76.031189, 37.256714], [-75.721985, 37.937073], [-76.232788, 38.319275], [-76.349976, 39.150085], [-76.542725, 38.717712], [-76.329285, 38.083313], [-76.960022, 38.23291], [-76.301575, 37.918091], [-76.258728, 36.966492], [-75.971802, 36.897278], [-75.867981, 36.551331], [-75.727478, 35.55072], [-76.363098, 34.808472], [-77.397583, 34.512085], [-78.054871, 33.925476], [-78.554321, 33.861328], [-79.060608, 33.49408], [-79.203491, 33.158508], [-80.30127, 32.509277], [-80.86499, 32.033325], [-81.336304, 31.440491], [-81.490417, 30.730103], [-81.313721, 30.035522], [-80.97998, 29.180115], [-80.535583, 28.472107], [-80.530029, 28.0401], [-80.056519, 26.880127], [-80.088013, 26.205688], [-80.13147, 25.816895], [-80.380981, 25.206299], [-80.679993, 25.080078], [-81.172119, 25.201294], [-81.330017, 25.640076], [-81.710022, 25.870117], [-82.23999, 26.730103], [-82.705078, 27.495117], [-82.855286, 27.886292], [-82.650024, 28.55011], [-82.929993, 29.100098], [-83.709595, 29.936707], [-84.099976, 30.090088], [-85.108826, 29.636292], [-85.287781, 29.686096], [-85.77301, 30.15271], [-86.400024, 30.400085], [-87.530273, 30.274475], [-88.417786, 30.384888], [-89.180481, 30.316101], [-89.604919, 30.176331], [-89.413696, 29.894287], [-89.429993, 29.488708], [-89.21759, 29.291077], [-89.408203, 29.159729], [-89.779297, 29.307129], [-90.154602, 29.117493], [-90.880188, 29.148682], [-91.626709, 29.677124], [-92.499084, 29.552307], [-93.226379, 29.783875], [-93.848389, 29.713684], [-94.690002, 29.480103], [-95.600281, 28.738708], [-96.593994, 28.307495], [-97.140015, 27.830078], [-97.369995, 27.380127], [-97.380005, 26.690125], [-97.330017, 26.210083], [-97.140198, 25.869507], [-97.138611, 25.86792], [-97.141785, 25.865906], [-97.528076, 24.992126], [-97.702881, 24.272278], [-97.776001, 22.932678], [-97.872375, 22.444275], [-97.698975, 21.898682], [-97.388977, 21.411072], [-97.18927, 20.635498], [-96.525513, 19.89093], [-96.292114, 19.320496], [-95.900879, 18.828125], [-94.838989, 18.562683], [-94.42572, 18.144287], [-93.548584, 18.423889], [-92.786072, 18.524902], [-92.037292, 18.704712], [-91.407898, 18.876099], [-90.77179, 19.284119], [-90.533508, 19.867493], [-90.451477, 20.70752], [-90.278625, 20.999878], [-89.601318, 21.261719], [-88.543884, 21.493713], [-87.658386, 21.458923], [-87.05188, 21.543518], [-86.812012, 21.331482], [-86.845886, 20.849915], [-87.383301, 20.255493], [-87.620972, 19.646484], [-87.436707, 19.472473], [-87.586487, 19.0401], [-87.837219, 18.259888], [-88.090576, 18.516724], [-88.299988, 18.500122], [-88.296326, 18.353271], [-88.106812, 18.348694], [-88.123413, 18.076721], [-88.285278, 17.644287], [-88.197876, 17.489502], [-88.302612, 17.131714], [-88.239502, 17.036072], [-88.355408, 16.530884], [-88.551819, 16.265503], [-88.732422, 16.233704], [-88.930603, 15.887329], [-88.604614, 15.706482], [-88.518311, 15.85553], [-88.224976, 15.727722], [-88.121094, 15.688721], [-87.901794, 15.864502], [-87.615601, 15.878906], [-87.522888, 15.797302], [-87.367676, 15.846924], [-86.903198, 15.756714], [-86.440918, 15.782898], [-86.119202, 15.893494], [-86.001892, 16.005493], [-85.683289, 15.953674], [-85.44397, 15.885681], [-85.182373, 15.909302], [-84.983704, 15.995911], [-84.526978, 15.8573], [-84.368225, 15.835083], [-84.062988, 15.648315], [-83.773987, 15.424072], [-83.4104, 15.270874], [-83.147217, 14.995911], [-83.233215, 14.899902], [-83.28418, 14.676697], [-83.182129, 14.31073], [-83.412476, 13.970093], [-83.519775, 13.567688], [-83.552185, 13.127075], [-83.498474, 12.869324], [-83.473328, 12.419128], [-83.626099, 12.320923], [-83.719604, 11.893127], [-83.650879, 11.629089], [-83.855408, 11.373291], [-83.808899, 11.103088], [-83.655579, 10.938904], [-83.402283, 10.395508], [-83.015686, 9.993103], [-82.546204, 9.566284], [-82.187073, 9.20752], [-82.207581, 8.995728], [-81.808594, 8.950684], [-81.714111, 9.032104], [-81.439209, 8.786316], [-80.947327, 8.858521], [-80.521912, 9.111084], [-79.914612, 9.312683], [-79.573303, 9.611694], [-79.021179, 9.552917], [-79.058411, 9.454712], [-78.500916, 9.420471], [-78.055908, 9.247681], [-77.729492, 8.946899], [-77.353271, 8.670471], [-76.836609, 8.638672], [-76.086304, 9.336914], [-75.674622, 9.443298], [-75.664673, 9.774109], [-75.480408, 10.61908], [-74.906921, 11.08313], [-74.276672, 11.102112], [-74.197205, 11.310486], [-73.414673, 11.227112], [-72.627808, 11.732117], [-72.23822, 11.955688], [-71.754089, 12.437317], [-71.39978, 12.376099], [-71.13739, 12.113098], [-71.331604, 11.776306], [-71.359985, 11.5401], [-71.947021, 11.423279], [-71.620789, 10.969482], [-71.632996, 10.446472], [-72.074097, 9.865723], [-71.695618, 9.072327], [-71.264587, 9.137329], [-71.039978, 9.860107], [-71.350098, 10.211914], [-71.400574, 10.969116], [-70.155212, 11.375488], [-70.293823, 11.846924], [-69.943176, 12.162292], [-69.58429, 11.459717], [-68.882996, 11.443481], [-68.233276, 10.885681], [-68.194092, 10.554688], [-67.296204, 10.545898], [-66.227783, 10.648682], [-65.655212, 10.200928], [-64.890381, 10.077271], [-64.329407, 10.389709], [-64.317993, 10.641479], [-63.079285, 10.701721], [-61.88092, 10.715698], [-62.730103, 10.420288], [-62.388489, 9.948303], [-61.588684, 9.873108], [-60.830505, 9.381287], [-60.671204, 8.580322], [-60.150085, 8.602905], [-59.758301, 8.367126], [-59.101685, 7.999329], [-58.48291, 7.347717], [-58.454895, 6.832886], [-58.078125, 6.809082], [-57.542175, 6.321289], [-57.1474, 5.973083], [-55.94928, 5.772888], [-55.841797, 5.953125], [-55.033203, 6.02533], [-53.958008, 5.756531], [-53.618408, 5.646484], [-52.88208, 5.409912], [-51.823303, 4.565918], [-51.657776, 4.156311], [-51.317078, 4.203491], [-51.069702, 3.650513], [-50.508789, 1.901489], [-49.973999, 1.736511], [-49.947083, 1.046326], [-50.69928, 0.223083], [-50.388184, -0.078369], [-48.620483, -0.235413], [-48.584412, -1.237793], [-47.82489, -0.581604], [-46.566589, -0.940979], [-44.905701, -1.551697], [-44.417603, -2.137695], [-44.581604, -2.691284], [-43.418701, -2.383118], [-41.472595, -2.911987], [-39.978577, -2.872986], [-38.500305, -3.700623], [-37.223206, -4.820923], [-36.452881, -5.109375], [-35.597778, -5.149475], [-35.235413, -5.464905], [-34.895996, -6.73822], [-34.72998, -7.343201], [-35.128174, -8.996399], [-35.636902, -9.649292], [-37.046509, -11.04071], [-37.683594, -12.171204], [-38.423889, -13.038086], [-38.673889, -13.057678], [-38.953186, -13.793396], [-38.882324, -15.666992], [-39.161011, -17.208374], [-39.267273, -17.867676], [-39.583496, -18.262207], [-39.760803, -19.599121], [-40.774719, -20.90448], [-40.944702, -21.937317], [-41.754089, -22.370605], [-41.988281, -22.970093], [-43.074707, -22.967712], [-44.647827, -23.35199], [-45.352112, -23.796814], [-46.472107, -24.088989], [-47.648987, -24.885193], [-48.495483, -25.877014], [-48.640991, -26.623718], [-48.47467, -27.175903], [-48.661499, -28.186096], [-48.888428, -28.674072], [-49.58728, -29.224487], [-50.696899, -30.984375], [-51.576172, -31.77771], [-52.256104, -32.2453], [-52.712097, -33.196594], [-53.373596, -33.768311], [-53.806396, -34.39679], [-54.935791, -34.952576], [-55.674011, -34.752686], [-56.21521, -34.859802], [-57.139709, -34.430481], [-57.81781, -34.462524], [-58.427002, -33.909485], [-58.495422, -34.431519], [-57.225769, -35.288025], [-57.362305, -35.977417], [-56.737488, -36.413086], [-56.788208, -36.901489], [-57.749084, -38.183899], [-59.231812, -38.720215], [-61.237427, -38.928406], [-62.335876, -38.827698], [-62.125793, -39.424072], [-62.330505, -40.172607], [-62.145996, -40.67688], [-62.745789, -41.028687], [-63.770508, -41.166809], [-64.732117, -40.802612], [-65.117981, -41.06427], [-64.978577, -42.057983], [-64.303406, -42.359009], [-63.75592, -42.043701], [-63.458008, -42.56311], [-64.378784, -42.873474], [-65.181824, -43.4953], [-65.328796, -44.501282], [-65.565186, -45.036804], [-66.509888, -45.039612], [-67.293823, -45.55188], [-67.580505, -46.301697], [-66.596985, -47.033875], [-65.640991, -47.236084], [-65.985107, -48.133301], [-67.166199, -48.697327], [-67.816101, -49.86969], [-68.728699, -50.264221], [-69.138489, -50.732483], [-68.815491, -51.771118], [-68.150024, -52.349976], [-68.571472, -52.299377], [-69.461304, -52.29187], [-69.942688, -52.537903], [-70.845093, -52.89917], [-71.006287, -53.833191], [-71.42981, -53.856384], [-72.557922, -53.531372], [-73.702698, -52.835083], [-74.946777, -52.262695], [-75.26001, -51.629272], [-74.976624, -51.043396], [-75.479675, -50.378296], [-75.607971, -48.673706], [-75.182678, -47.711914], [-74.126587, -46.939209], [-75.644409, -46.647583], [-74.692078, -45.763977], [-74.351685, -44.103027], [-73.240295, -44.454895], [-72.717712, -42.383301], [-73.388916, -42.117493], [-73.701294, -43.365784], [-74.331909, -43.224976], [-74.017883, -41.7948], [-73.677124, -39.9422], [-73.21759, -39.258606], [-73.505493, -38.282898], [-73.588013, -37.156311], [-73.166687, -37.123779], [-72.553101, -35.508789], [-71.861694, -33.909119], [-71.438477, -32.418884], [-71.668701, -30.920593], [-71.369995, -30.095703], [-71.489807, -28.861389], [-70.90509, -27.640381], [-70.724976, -25.705872], [-70.403992, -23.628906], [-70.091187, -21.393311], [-70.164429, -19.756409], [-70.372498, -18.3479], [-71.375183, -17.773804], [-71.461975, -17.363403], [-73.444519, -16.359375], [-75.237793, -15.265686], [-76.009216, -14.649292], [-76.423401, -13.823181], [-76.259216, -13.534973], [-77.106201, -12.222717], [-78.092102, -10.377686], [-79.036926, -8.386597], [-79.445923, -7.930786], [-79.760498, -7.194275], [-80.537476, -6.541687], [-81.25, -6.13678], [-80.92627, -5.690491], [-81.410889, -4.736694], [-81.099609, -4.036377], [-80.30249, -3.404785], [-79.770203, -2.657471], [-79.986511, -2.220703], [-80.368713, -2.685181], [-80.967712, -2.246887], [-80.764771, -1.965027], [-80.933594, -1.057373], [-80.583313, -0.906677], [-80.399292, -0.283691], [-80.020813, 0.360474], [-80.090576, 0.768494], [-79.542786, 0.98291], [-78.855286, 1.38092], [-78.990906, 1.691284], [-78.617798, 1.766479], [-78.662109, 2.267273], [-78.427612, 2.6297], [-77.931519, 2.696716], [-77.510376, 3.325073], [-77.127686, 3.84967], [-77.496277, 4.087708], [-77.307617, 4.668091], [-77.533203, 5.582886], [-77.318787, 5.845276], [-77.476685, 6.691101], [-77.881592, 7.223877], [-78.214905, 7.512329], [-78.429077, 8.052124], [-78.182007, 8.319275], [-78.435486, 8.387695], [-78.62207, 8.718079], [-79.1203, 8.996094], [-79.5578, 8.932495], [-79.760498, 8.584473], [-80.16449, 8.333313], [-80.382629, 8.298523], [-80.480713, 8.090271], [-80.003601, 7.547485], [-80.276611, 7.419678], [-80.421082, 7.271484], [-80.886414, 7.22052], [-81.059509, 7.817871], [-81.189697, 7.647888], [-81.51947, 7.706726], [-81.721313, 8.108887], [-82.131409, 8.175476], [-82.390869, 8.29248], [-82.820007, 8.290894], [-82.850891, 8.073914], [-82.965698, 8.225098], [-83.508423, 8.446899], [-83.711487, 8.656921], [-83.596313, 8.830505], [-83.632629, 9.051514], [-83.909912, 9.290894], [-84.303406, 9.487488], [-84.647583, 9.615479], [-84.713379, 9.908081], [-84.975586, 10.086731], [-84.911377, 9.796082], [-85.110901, 9.557129], [-85.339478, 9.834473], [-85.660706, 9.933289], [-85.797424, 10.134888], [-85.791687, 10.43927], [-85.659302, 10.754272], [-85.941711, 10.895325], [-85.712524, 11.088501], [-86.058411, 11.403503], [-86.525879, 11.806885], [-86.745911, 12.144104], [-87.16748, 12.458313], [-87.668518, 12.909912], [-87.557495, 13.064697], [-87.392395, 12.914124], [-87.316589, 12.98468], [-87.48938, 13.297485], [-87.793091, 13.384521], [-87.904114, 13.149109], [-88.483276, 13.163879], [-88.843201, 13.259705], [-89.256714, 13.458679], [-89.812378, 13.520691], [-90.095581, 13.735474], [-90.608582, 13.909912], [-91.232422, 13.927917], [-91.689697, 14.126282], [-92.227722, 14.538879], [-93.359375, 15.615479], [-93.875183, 15.940308], [-94.691589, 16.201111], [-95.250183, 16.128296], [-96.053406, 15.752075], [-96.557373, 15.653503], [-97.263611, 15.917114], [-98.013, 16.1073], [-98.947693, 16.566101], [-99.697388, 16.706299], [-100.829529, 17.171082], [-101.666077, 17.649109], [-101.918518, 17.916077], [-102.478088, 17.975891], [-103.500977, 18.292297], [-103.91748, 18.748718], [-104.992004, 19.316284], [-105.492981, 19.946899], [-105.731384, 20.434082], [-105.397705, 20.531677], [-105.50061, 20.816895], [-105.270691, 21.076294], [-105.265808, 21.422119], [-105.603088, 21.871277], [-105.69342, 22.269104], [-106.028687, 22.773682], [-106.909912, 23.767883], [-107.915405, 24.548889], [-108.401917, 25.172302], [-109.260193, 25.580688], [-109.444092, 25.82489], [-109.291626, 26.442871], [-109.801392, 26.676086], [-110.391724, 27.162109], [-110.640991, 27.859924], [-111.178894, 27.941284], [-111.759583, 28.468079], [-112.22821, 28.954529], [-112.27179, 29.266907], [-112.809509, 30.021118], [-113.163818, 30.786926], [-113.148682, 31.171082], [-113.871887, 31.567688], [-114.205688, 31.524109], [-114.776428, 31.799683], [-114.936707, 31.393494], [-114.771179, 30.913696], [-114.673889, 30.16272], [-114.330994, 29.750488], [-113.588806, 29.061707], [-113.424011, 28.826294], [-113.271912, 28.754883], [-113.140015, 28.411316], [-112.96228, 28.425293], [-112.761597, 27.780273], [-112.457886, 27.525879], [-112.244873, 27.171875], [-111.616516, 26.662903], [-111.284607, 25.732727], [-110.987793, 25.294678], [-110.710022, 24.826111], [-110.655029, 24.298706], [-110.172791, 24.265686], [-109.77179, 23.811279], [-109.409119, 23.364685], [-109.433411, 23.18573], [-109.854187, 22.818298], [-110.031311, 22.82312], [-110.294983, 23.431091], [-110.949524, 24.001099], [-111.670593, 24.484497], [-112.182007, 24.738525], [-112.148987, 25.470276], [-112.30072, 26.012085], [-112.777283, 26.322083], [-113.4646, 26.768311], [-113.59668, 26.639526], [-113.848877, 26.900085], [-114.465698, 27.14209], [-115.055115, 27.722717], [-114.982178, 27.798279], [-114.570312, 27.741516], [-114.19928, 28.115112], [-114.161987, 28.566101], [-114.931824, 29.27948], [-115.518677, 29.556274], [-115.88739, 30.180908], [-116.258301, 30.836487], [-116.721497, 31.635681], [-117.127686, 32.535278], [-117.295898, 33.046326], [-117.943909, 33.621277], [-118.410583, 33.740906], [-118.519897, 34.027893], [-119.080994, 34.078125], [-119.438782, 34.348511], [-120.367798, 34.447083], [-120.622803, 34.608521], [-120.744324, 35.156921], [-121.7146, 36.161682], [-122.547485, 37.55188], [-122.512024, 37.783508], [-122.953186, 38.113708], [-123.727112, 38.951721], [-123.865112, 39.76709], [-124.39801, 40.313293], [-124.178772, 41.14209], [-124.213684, 41.999695], [-124.532776, 42.766113], [-124.14209, 43.708496], [-123.898926, 45.523499], [-124.07959, 46.864685], [-124.395691, 47.720276], [-124.687195, 48.184509], [-124.566101, 48.3797], [-123.119995, 48.0401], [-122.58728, 47.09613], [-122.340027, 47.360107], [-122.5, 48.180115], [-122.840027, 49.000122], [-122.974182, 49.002686], [-124.910217, 49.98468], [-125.624573, 50.416687], [-127.435608, 50.830688], [-127.992676, 51.715881], [-127.850281, 52.329712], [-129.1297, 52.755493], [-129.305176, 53.561707], [-130.514893, 54.28772], [-130.536072, 54.802673], [-131.085815, 55.178894], [-131.967224, 55.497925], [-132.25, 56.370117], [-133.539185, 57.178894], [-134.078003, 58.123108], [-135.038208, 58.187683], [-136.627991, 58.21228], [-137.799988, 58.500122], [-139.867798, 59.537903], [-140.825195, 59.727478], [-142.574402, 60.084473], [-143.958801, 59.999329], [-145.925476, 60.458679], [-147.11438, 60.884705], [-148.224304, 60.673096], [-148.018005, 59.978271], [-148.570801, 59.914307], [-149.727783, 59.705688], [-150.608215, 59.368286], [-151.716309, 59.155884], [-151.859375, 59.745117], [-151.409729, 60.725891], [-150.346924, 61.033691], [-150.621094, 61.284485], [-151.895813, 60.727295], [-152.578308, 60.061707], [-154.019104, 59.350281], [-153.287476, 58.864685], [-154.232483, 58.146484], [-155.307495, 57.727905], [-156.308289, 57.422913], [-156.556091, 56.980103], [-158.117187, 56.463684], [-158.433289, 55.99408], [-159.603271, 55.566711], [-160.289673, 55.643677], [-161.223022, 55.364685], [-162.237793, 55.024292], [-163.069397, 54.68988], [-164.785583, 54.404297], [-164.9422, 54.572327], [-163.848328, 55.03949], [-162.869995, 55.348083], [-161.804199, 55.895081], [-160.563599, 56.008118], [-160.070496, 56.418091], [-158.684387, 57.016724], [-158.461121, 57.216919], [-157.722778, 57.570129], [-157.550293, 58.328308], [-157.041687, 58.918884], [-158.194702, 58.615906], [-158.517212, 58.787903], [-159.058594, 58.424316], [-159.711609, 58.931519], [-159.981201, 58.572693], [-160.355286, 59.071106], [-161.35498, 58.670898], [-161.968811, 58.671692], [-162.054993, 59.266907], [-161.874084, 59.633728], [-162.518005, 59.989685], [-163.818298, 59.798096], [-164.66217, 60.267517], [-165.346375, 60.507507], [-165.350769, 61.073914], [-166.121399, 61.500122], [-165.734375, 62.075073], [-164.919189, 62.633118], [-164.5625, 63.146484], [-163.753296, 63.219482], [-163.0672, 63.059509], [-162.260498, 63.54187], [-161.534424, 63.455872], [-160.772522, 63.766113], [-160.958313, 64.2229], [-161.518005, 64.402893], [-160.77771, 64.788696], [-161.391907, 64.777283], [-162.453003, 64.559509], [-162.757813, 64.338684], [-163.546387, 64.559082], [-164.960815, 64.447083], [-166.425293, 64.686707], [-166.844971, 65.088928], [-168.110474, 65.670105], [-166.7052, 66.088318], [-164.47467, 66.576721], [-163.652527, 66.576721], [-163.788513, 66.077271], [-161.677795, 66.116089], [-162.489685, 66.735474], [-163.719727, 67.116516], [-164.430908, 67.616272], [-165.390198, 68.042908], [-166.764404, 68.358887], [-166.204712, 68.883118], [-164.430786, 68.915527], [-163.168579, 69.371094], [-162.930481, 69.858093], [-161.908875, 70.333313], [-160.934814, 70.447693], [-159.039185, 70.891724], [-158.11969, 70.824707], [-156.580811, 71.35791], [-155.06781, 71.147888], [-154.344177, 70.696472], [-153.900024, 70.890076], [-152.210022, 70.830078], [-152.27002, 70.600098], [-150.73999, 70.430115], [-149.719971, 70.53009], [-147.613281, 70.214111], [-145.690002, 70.120117], [-144.919983, 69.990112], [-143.589417, 70.152527], [-142.07251, 69.851929], [-140.985901, 69.712097], [-139.120483, 69.47113], [-137.546387, 68.990112], [-136.503601, 68.898071], [-135.625671, 69.315125], [-134.414612, 69.627502], [-132.929199, 69.50531], [-131.431274, 69.944519], [-129.794678, 70.193726], [-129.107727, 69.779297], [-128.361511, 70.012878], [-128.138184, 70.483887], [-127.447083, 70.377319], [-125.756287, 69.480713], [-124.424805, 70.158508], [-124.289612, 69.399719], [-123.061096, 69.563721], [-122.683411, 69.85553], [-121.47229, 69.797913], [-119.94281, 69.37793], [-117.6026, 69.011292], [-116.226379, 68.841492], [-115.246887, 68.905884], [-113.897888, 68.398926], [-115.30481, 67.90271], [-113.497192, 67.688293], [-110.797913, 67.806091], [-109.946106, 67.981079], [-108.880188, 67.381531], [-107.792419, 67.887512], [-108.812988, 68.311707], [-108.167175, 68.653931], [-106.950012, 68.700073], [-106.150024, 68.80011], [-105.342773, 68.561279], [-104.337891, 68.018127], [-103.221069, 68.0979], [-101.454285, 67.646912], [-99.901978, 67.805725], [-98.443176, 67.781677], [-98.558594, 68.403931], [-97.669495, 68.578674], [-96.119873, 68.239502], [-96.125793, 67.293518], [-95.48938, 68.090698], [-94.684998, 68.063904], [-94.232788, 69.069092], [-95.304077, 69.68573], [-96.471313, 70.089905], [-96.391113, 71.194885], [-95.208801, 71.920471], [-93.889893, 71.760071], [-92.878113, 71.318726], [-91.519592, 70.191284], [-92.406921, 69.700073], [-90.547119, 69.497681]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-119.40199, 68.53554, -100.98078, 73.31459], geometry: { type: "Polygon", coordinates: [[[-114.16717, 73.12145], [-114.66634, 72.65277], [-112.44102, 72.9554], [-111.05039, 72.4504], [-109.92035, 72.96113], [-109.00654, 72.63335], [-108.18835, 71.65089], [-107.68599, 72.06548], [-108.39639, 73.08953], [-107.51645, 73.23598], [-106.52259, 73.07601], [-105.40246, 72.67259], [-104.77484, 71.6984], [-104.46476, 70.99297], [-102.78537, 70.49776], [-100.98078, 70.02432], [-101.08929, 69.58447], [-102.73116, 69.50402], [-102.09329, 69.11962], [-102.43024, 68.75282], [-104.24, 68.91], [-105.96, 69.18], [-107.12254, 69.11922], [-109, 68.78], [-111.9668, 68.60446], [-113.3132, 68.53554], [-113.85496, 69.00744], [-115.22, 69.28], [-116.10794, 69.16821], [-117.34, 69.96], [-116.67473, 70.06655], [-115.13112, 70.2373], [-113.72141, 70.19237], [-112.4161, 70.36638], [-114.35, 70.6], [-116.48684, 70.52045], [-117.9048, 70.54056], [-118.43238, 70.9092], [-116.11311, 71.30918], [-117.65568, 71.2952], [-119.40199, 71.55859], [-118.56267, 72.30785], [-117.86642, 72.70594], [-115.18909, 73.31459], [-114.16717, 73.12145]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1.5 }, bbox: [-106.94, 72.76, -104.5, 73.64], geometry: { type: "Polygon", coordinates: [[[-104.5, 73.42], [-105.38, 72.76], [-106.94, 73.46], [-106.6, 73.6], [-105.26, 73.64], [-104.5, 73.42]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [-80.876099, 72.742203, -76.251404, 73.75972], geometry: { type: "Polygon", coordinates: [[[-76.34, 73.102685], [-76.251404, 72.826385], [-77.314438, 72.855545], [-78.39167, 72.876656], [-79.486252, 72.742203], [-79.775833, 72.802902], [-80.876099, 73.333183], [-80.833885, 73.693184], [-80.353058, 73.75972], [-78.064438, 73.651932], [-76.34, 73.102685]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-90.20516, 61.930897, -61.851981, 73.803816], geometry: { type: "Polygon", coordinates: [[[-86.562179, 73.157447], [-85.774371, 72.534126], [-84.850112, 73.340278], [-82.31559, 73.750951], [-80.600088, 72.716544], [-80.748942, 72.061907], [-78.770639, 72.352173], [-77.824624, 72.749617], [-75.605845, 72.243678], [-74.228616, 71.767144], [-74.099141, 71.33084], [-72.242226, 71.556925], [-71.200015, 70.920013], [-68.786054, 70.525024], [-67.91497, 70.121948], [-66.969033, 69.186087], [-68.805123, 68.720198], [-66.449866, 68.067163], [-64.862314, 67.847539], [-63.424934, 66.928473], [-61.851981, 66.862121], [-62.163177, 66.160251], [-63.918444, 64.998669], [-65.14886, 65.426033], [-66.721219, 66.388041], [-68.015016, 66.262726], [-68.141287, 65.689789], [-67.089646, 65.108455], [-65.73208, 64.648406], [-65.320168, 64.382737], [-64.669406, 63.392927], [-65.013804, 62.674185], [-66.275045, 62.945099], [-68.783186, 63.74567], [-67.369681, 62.883966], [-66.328297, 62.280075], [-66.165568, 61.930897], [-68.877367, 62.330149], [-71.023437, 62.910708], [-72.235379, 63.397836], [-71.886278, 63.679989], [-73.378306, 64.193963], [-74.834419, 64.679076], [-74.818503, 64.389093], [-77.70998, 64.229542], [-78.555949, 64.572906], [-77.897281, 65.309192], [-76.018274, 65.326969], [-73.959795, 65.454765], [-74.293883, 65.811771], [-73.944912, 66.310578], [-72.651167, 67.284576], [-72.92606, 67.726926], [-73.311618, 68.069437], [-74.843307, 68.554627], [-76.869101, 68.894736], [-76.228649, 69.147769], [-77.28737, 69.76954], [-78.168634, 69.826488], [-78.957242, 70.16688], [-79.492455, 69.871808], [-81.305471, 69.743185], [-84.944706, 69.966634], [-87.060003, 70.260001], [-88.681713, 70.410741], [-89.51342, 70.762038], [-88.467721, 71.218186], [-89.888151, 71.222552], [-90.20516, 72.235074], [-89.436577, 73.129464], [-88.408242, 73.537889], [-85.826151, 73.803816], [-86.562179, 73.157447]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-102.5, 71.27285, -96.54, 73.84389], geometry: { type: "Polygon", coordinates: [[[-100.35642, 73.84389], [-99.16387, 73.63339], [-97.38, 73.76], [-97.12, 73.47], [-98.05359, 72.99052], [-96.54, 72.56], [-96.72, 71.66], [-98.35966, 71.27285], [-99.32286, 71.35639], [-100.01482, 71.73827], [-102.5, 72.51], [-102.48, 72.83], [-100.43836, 72.70588], [-101.54, 73.36], [-100.35642, 73.84389]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [139.86312, 73.20544, 143.60385, 73.85758], geometry: { type: "Polygon", coordinates: [[[143.60385, 73.21244], [142.08763, 73.20544], [140.038155, 73.31692], [139.86312, 73.36983], [140.81171, 73.76506], [142.06207, 73.85758], [143.48283, 73.47525], [143.60385, 73.21244]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0.5 }, bbox: [-96.033745, 72.024596, -90.509793, 74.134907], geometry: { type: "Polygon", coordinates: [[[-93.196296, 72.771992], [-94.269047, 72.024596], [-95.409856, 72.061881], [-96.033745, 72.940277], [-96.018268, 73.43743], [-95.495793, 73.862417], [-94.503658, 74.134907], [-92.420012, 74.100025], [-90.509793, 73.856732], [-92.003965, 72.966244], [-93.196296, 72.771992]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-125.92896, 70.90164, -115.51081, 74.44893], geometry: { type: "Polygon", coordinates: [[[-120.46, 71.4], [-123.09219, 70.90164], [-123.62, 71.34], [-125.92896, 71.86868], [-125.59271, 72.19452], [-124.80729, 73.02256], [-123.94, 73.68], [-124.91775, 74.29275], [-121.53788, 74.44893], [-120.10978, 74.24135], [-117.55564, 74.18577], [-116.58442, 73.89607], [-115.51081, 73.47519], [-116.76794, 73.22292], [-119.22, 72.52], [-120.46, 71.82], [-120.46, 71.4]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 1 }, bbox: [146.11919, 74.68892, 150.73167, 75.49682], geometry: { type: "Polygon", coordinates: [[[150.73167, 75.08406], [149.575925, 74.68892], [147.977465, 74.778355], [146.11919, 75.17298], [146.358485, 75.49682], [148.22223, 75.345845], [150.73167, 75.08406]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [-96.820932, 74.592347, -93.612756, 75.647218], geometry: { type: "Polygon", coordinates: [[[-93.612756, 74.979997], [-94.156909, 74.592347], [-95.608681, 74.666864], [-96.820932, 74.927623], [-96.288587, 75.377828], [-94.85082, 75.647218], [-93.977747, 75.29649], [-93.612756, 74.979997]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [136.97439, 74.61148, 145.086285, 76.13676], geometry: { type: "Polygon", coordinates: [[[145.086285, 75.562625], [144.3, 74.82], [140.61381, 74.84768], [138.95544, 74.61148], [136.97439, 75.26167], [137.51176, 75.94917], [138.831075, 76.13676], [141.471615, 76.09289], [145.086285, 75.562625]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-102.56552, 74.89744, -97.704415, 76.72], geometry: { type: "Polygon", coordinates: [[[-98.5, 76.72], [-97.735585, 76.25656], [-97.704415, 75.74344], [-98.16, 75], [-99.80874, 74.89744], [-100.88366, 75.05736], [-100.86292, 75.64075], [-102.50209, 75.5638], [-102.56552, 76.3366], [-101.48973, 76.30537], [-99.98349, 76.64634], [-98.57699, 76.58859], [-98.5, 76.72]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-117.7104, 74.39427, -105.70498, 76.79417], geometry: { type: "Polygon", coordinates: [[[-108.21141, 76.20168], [-107.81943, 75.84552], [-106.92893, 76.01282], [-105.881, 75.9694], [-105.70498, 75.47951], [-106.31347, 75.00527], [-109.7, 74.85], [-112.22307, 74.41696], [-113.74381, 74.39427], [-113.87135, 74.72029], [-111.79421, 75.1625], [-116.31221, 75.04343], [-117.7104, 75.2222], [-116.34602, 76.19903], [-115.40487, 76.47887], [-112.59056, 76.14134], [-110.81422, 75.54919], [-109.0671, 75.47321], [-110.49726, 76.42982], [-109.5811, 76.79417], [-108.54859, 76.67832], [-108.21141, 76.20168]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [51.455754, 70.632743, 68.852211, 76.939697], geometry: { type: "Polygon", coordinates: [[[57.535693, 70.720464], [56.944979, 70.632743], [53.677375, 70.762658], [53.412017, 71.206662], [51.601895, 71.474759], [51.455754, 72.014881], [52.478275, 72.229442], [52.444169, 72.774731], [54.427614, 73.627548], [53.50829, 73.749814], [55.902459, 74.627486], [55.631933, 75.081412], [57.868644, 75.60939], [61.170044, 76.251883], [64.498368, 76.439055], [66.210977, 76.809782], [68.15706, 76.939697], [68.852211, 76.544811], [68.180573, 76.233642], [64.637326, 75.737755], [61.583508, 75.260885], [58.477082, 74.309056], [56.986786, 73.333044], [55.419336, 72.371268], [55.622838, 71.540595], [57.535693, 70.720464]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-97.121379, 74.392307, -79.833933, 77.161389], geometry: { type: "Polygon", coordinates: [[[-94.684086, 77.097878], [-93.573921, 76.776296], [-91.605023, 76.778518], [-90.741846, 76.449597], [-90.969661, 76.074013], [-89.822238, 75.847774], [-89.187083, 75.610166], [-87.838276, 75.566189], [-86.379192, 75.482421], [-84.789625, 75.699204], [-82.753445, 75.784315], [-81.128531, 75.713983], [-80.057511, 75.336849], [-79.833933, 74.923127], [-80.457771, 74.657304], [-81.948843, 74.442459], [-83.228894, 74.564028], [-86.097452, 74.410032], [-88.15035, 74.392307], [-89.764722, 74.515555], [-92.422441, 74.837758], [-92.768285, 75.38682], [-92.889906, 75.882655], [-93.893824, 76.319244], [-95.962457, 76.441381], [-97.121379, 76.751078], [-96.745123, 77.161389], [-94.684086, 77.097878]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 0.5 }, bbox: [-122.854925, 75.900019, -116.198587, 77.645287], geometry: { type: "Polygon", coordinates: [[[-116.198587, 77.645287], [-116.335813, 76.876962], [-117.106051, 76.530032], [-118.040412, 76.481172], [-119.899318, 76.053213], [-121.499995, 75.900019], [-122.854924, 76.116543], [-122.854925, 76.116543], [-121.157535, 76.864508], [-119.103939, 77.51222], [-117.570131, 77.498319], [-116.198587, 77.645287]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-17.625, -34.819092, 180, 77.697876], geometry: { type: "Polygon", coordinates: [[[106.970276, 76.974304], [107.240112, 76.480103], [108.153931, 76.723328], [111.077271, 76.710083], [113.331482, 76.22229], [114.134277, 75.847717], [113.885498, 75.327881], [112.779297, 75.031921], [110.151306, 74.476685], [109.400085, 74.180115], [110.640076, 74.0401], [112.119324, 73.78772], [113.01947, 73.976929], [113.529724, 73.335083], [113.968872, 73.59491], [115.567871, 73.75293], [118.776306, 73.587708], [119.020081, 73.120117], [123.200684, 72.971313], [123.257874, 73.735107], [125.380127, 73.56012], [126.976501, 73.565491], [128.591309, 73.038696], [129.051697, 72.398682], [128.460083, 71.980103], [129.716125, 71.193115], [131.288696, 70.787109], [132.253479, 71.836304], [133.857727, 71.386475], [135.562073, 71.655273], [137.497681, 71.347717], [138.234131, 71.628113], [139.869873, 71.487915], [139.147888, 72.416321], [140.468079, 72.849487], [149.500122, 72.200073], [150.351318, 71.606506], [152.968872, 70.842285], [157.006897, 71.031494], [158.997925, 70.866699], [159.830322, 70.453308], [159.708679, 69.722107], [160.940674, 69.437317], [162.279114, 69.64209], [164.05249, 69.668274], [165.940491, 69.472107], [167.835693, 69.582703], [169.577698, 68.693909], [170.816895, 69.013672], [170.008301, 69.652893], [170.453491, 70.097107], [173.643921, 69.817505], [175.724121, 69.877319], [178.600098, 69.400085], [180, 68.963722], [180, 64.979584], [179.99292, 64.974304], [178.707275, 64.534912], [177.411316, 64.608276], [178.31311, 64.075928], [178.908325, 63.252075], [179.370483, 62.982727], [179.486511, 62.569092], [179.228271, 62.304077], [177.364319, 62.521912], [174.569275, 61.769287], [173.680115, 61.65271], [172.150085, 60.950073], [170.698486, 60.336304], [170.330872, 59.881897], [168.900513, 60.573486], [166.295105, 59.788696], [165.840088, 60.160095], [164.876892, 59.731689], [163.539307, 59.868713], [163.217102, 59.211121], [162.017273, 58.243286], [162.053101, 57.839111], [163.191895, 57.615112], [163.057922, 56.159302], [162.1297, 56.122314], [161.701477, 55.285706], [162.117493, 54.855286], [160.368896, 54.344482], [160.021729, 53.202698], [158.530884, 52.958679], [158.231323, 51.942688], [156.789917, 51.011108], [156.420105, 51.700073], [155.991882, 53.158875], [155.433716, 55.381104], [155.91449, 56.767883], [156.758301, 57.364685], [156.810486, 57.832092], [158.364319, 58.055725], [160.150696, 59.31488], [161.87207, 60.343079], [163.669678, 61.14093], [164.473694, 62.55072], [163.258484, 62.466309], [162.657898, 61.642517], [160.121521, 60.544312], [159.302307, 61.774109], [156.720703, 61.434509], [154.218079, 59.758301], [155.043884, 59.145081], [152.81189, 58.883911], [151.265686, 58.780884], [151.338074, 59.504089], [149.783691, 59.655701], [148.544922, 59.16449], [145.487305, 59.336487], [142.197876, 59.0401], [138.958496, 57.088074], [135.126282, 54.729675], [136.701721, 54.603699], [137.193481, 53.977295], [138.164673, 53.755127], [138.804688, 54.2547], [139.901489, 54.189697], [141.345276, 53.089722], [141.379272, 52.238892], [140.597473, 51.239685], [140.513123, 50.045471], [140.062073, 48.446716], [138.554688, 46.999695], [138.219727, 46.307922], [136.862305, 45.143494], [135.51532, 43.989075], [134.869507, 43.398315], [133.536926, 42.811523], [132.906311, 42.798523], [132.278076, 43.284485], [130.935913, 42.552673], [130.78009, 42.220093], [130.400085, 42.28009], [129.965881, 41.941284], [129.66748, 41.601074], [129.705322, 40.882874], [129.18811, 40.661926], [129.010498, 40.485474], [128.633484, 40.18988], [127.967529, 40.025513], [127.533508, 39.756897], [127.502075, 39.323914], [127.385498, 39.213501], [127.783325, 39.050903], [128.34967, 38.612305], [129.212891, 37.432495], [129.46051, 36.784302], [129.468323, 35.63208], [129.091492, 35.08252], [128.185913, 34.890503], [127.386475, 34.475708], [126.485718, 34.390076], [126.373901, 34.934692], [126.559326, 35.684692], [126.117493, 36.725525], [126.860291, 36.893921], [126.174683, 37.749695], [125.689087, 37.940125], [125.568481, 37.752075], [125.27533, 37.669128], [125.240112, 37.8573], [124.981079, 37.948914], [124.71228, 38.108276], [124.986084, 38.548523], [125.221924, 38.665894], [125.132874, 38.848694], [125.386719, 39.387878], [125.321106, 39.551514], [124.737488, 39.660278], [124.265686, 39.928528], [122.867676, 39.637878], [122.131531, 39.170471], [121.054688, 38.897522], [121.586121, 39.360901], [121.376892, 39.750305], [122.168701, 40.422485], [121.640503, 40.946472], [120.768677, 40.593506], [119.639709, 39.898071], [119.023499, 39.252319], [118.042725, 39.204285], [117.532715, 38.737671], [118.059692, 38.061523], [118.878296, 37.897278], [118.911682, 37.448486], [119.702881, 37.156494], [120.823486, 37.870483], [121.711304, 37.481079], [122.35791, 37.454529], [122.520081, 36.930725], [121.104309, 36.651306], [120.637085, 36.111511], [119.664673, 35.609924], [119.151306, 34.909912], [120.227478, 34.360474], [120.620483, 33.376709], [121.229126, 32.460327], [121.908081, 31.692322], [121.891907, 30.94928], [121.264282, 30.676331], [121.503479, 30.142883], [122.092102, 29.83252], [121.938477, 29.018127], [121.684509, 28.225525], [121.125671, 28.135681], [120.395508, 27.053284], [119.58551, 25.740906], [118.656921, 24.547485], [117.281677, 23.624512], [115.890686, 22.782898], [114.763916, 22.668091], [114.152527, 22.223877], [113.806885, 22.548279], [113.241089, 22.051514], [111.843689, 21.550476], [110.785522, 21.397278], [110.444092, 20.341125], [109.889893, 20.282471], [109.627686, 21.008301], [109.864502, 21.395081], [108.522888, 21.715271], [108.050293, 21.55249], [106.715088, 20.696899], [105.881714, 19.752075], [105.662109, 19.058289], [106.42688, 18.004089], [107.361877, 16.69751], [108.26947, 16.079712], [108.877075, 15.276672], [109.335327, 13.426086], [109.200073, 11.66687], [108.366089, 11.008301], [107.220886, 10.364502], [106.40509, 9.530884], [105.158325, 8.59967], [104.795288, 9.241089], [105.076294, 9.918518], [104.334473, 10.486694], [103.497314, 10.63269], [103.090698, 11.153687], [102.585083, 12.186707], [101.687073, 12.645874], [100.831909, 12.627075], [100.978516, 13.41272], [100.0979, 13.406921], [100.018677, 12.307129], [99.478882, 10.846497], [99.153687, 9.963074], [99.222473, 9.239319], [99.873901, 9.207886], [100.279724, 8.295288], [100.45929, 7.429687], [101.017273, 6.856873], [101.623108, 6.740723], [102.141296, 6.22168], [102.371277, 6.128296], [102.961731, 5.524475], [103.381287, 4.855103], [103.438721, 4.181702], [103.332092, 3.726685], [103.429504, 3.382874], [103.502502, 2.791077], [103.854675, 2.515503], [104.247925, 1.631287], [104.228882, 1.293091], [103.519714, 1.226318], [102.57373, 1.967102], [101.390686, 2.760925], [101.273682, 3.270325], [100.695496, 3.939087], [100.557495, 4.767273], [100.196716, 5.3125], [100.306274, 6.04071], [100.085876, 6.464478], [99.690674, 6.848328], [99.519714, 7.343506], [98.988281, 7.908081], [98.503906, 8.382324], [98.339722, 7.794495], [98.150085, 8.350098], [98.259277, 8.973877], [98.553528, 9.933105], [98.457275, 10.675293], [98.764526, 11.441284], [98.428284, 12.033081], [98.509705, 13.122498], [98.103699, 13.640503], [97.77771, 14.83728], [97.597107, 16.100708], [97.164673, 16.928711], [96.50592, 16.427307], [95.369324, 15.714478], [94.808472, 15.803528], [94.188904, 16.038086], [94.533508, 17.277283], [94.32489, 18.213501], [93.541077, 19.366516], [93.66333, 19.727112], [93.078308, 19.855286], [92.36853, 20.670898], [92.082886, 21.192322], [92.02533, 21.701721], [91.8349, 22.182922], [91.417114, 22.765076], [90.496094, 22.805115], [90.587097, 22.392883], [90.272888, 21.836487], [89.847473, 22.039124], [89.702087, 21.857117], [89.418884, 21.966309], [89.032104, 22.055725], [88.888916, 21.690674], [88.208496, 21.703308], [86.975708, 21.495483], [87.033081, 20.743286], [86.499329, 20.151672], [85.060303, 19.478699], [83.941101, 18.302124], [83.18927, 17.671326], [82.192871, 17.016724], [82.191284, 16.556702], [81.692688, 16.310303], [80.792114, 15.952087], [80.32489, 15.899292], [80.025085, 15.136475], [80.233276, 13.835876], [80.286316, 13.006287], [79.862488, 12.056274], [79.858093, 10.3573], [79.340515, 10.308899], [78.885498, 9.546082], [79.189697, 9.216675], [78.278076, 8.933105], [77.941284, 8.25293], [77.539917, 7.965515], [76.593079, 8.899292], [76.130127, 10.299683], [75.746521, 11.308289], [75.396118, 11.781311], [74.864929, 12.741882], [74.616699, 13.992676], [74.443909, 14.61731], [73.534302, 15.990723], [73.119873, 17.928711], [72.820923, 19.208313], [72.824524, 20.419495], [72.630676, 21.356079], [71.175293, 20.757507], [70.47052, 20.877319], [69.164124, 22.089294], [69.644897, 22.450684], [69.34967, 22.843323], [68.176697, 23.692078], [67.443726, 23.944885], [67.145508, 24.663696], [66.372925, 25.425293], [64.530518, 25.237122], [62.905701, 25.218506], [61.497498, 25.078308], [59.616089, 25.380127], [58.525879, 25.610107], [57.397278, 25.739929], [56.970886, 26.966125], [56.492126, 27.143311], [55.723694, 26.964722], [54.715088, 26.480713], [53.493103, 26.8125], [52.483704, 27.580872], [51.520874, 27.865723], [50.853088, 28.814514], [50.115112, 30.147888], [49.576904, 29.985718], [48.941284, 30.317078], [48.568115, 29.92688], [47.974487, 29.975891], [48.183289, 29.534485], [48.093872, 29.306274], [48.416077, 28.552124], [48.807678, 27.689697], [49.299683, 27.461304], [49.470886, 27.110107], [50.152527, 26.689697], [50.213074, 26.2771], [50.113281, 25.944092], [50.239929, 25.608093], [50.527527, 25.327881], [50.660706, 24.999878], [50.81012, 24.754883], [50.743896, 25.482483], [51.013489, 26.00708], [51.286499, 26.114685], [51.589111, 25.801086], [51.606689, 25.215698], [51.389709, 24.627502], [51.579529, 24.245483], [51.757507, 24.294128], [51.794495, 24.019897], [52.577087, 24.17749], [53.404114, 24.151306], [54.008118, 24.121887], [54.693115, 24.797913], [55.439087, 25.439087], [56.070923, 26.055481], [56.362122, 26.395874], [56.485718, 26.309082], [56.391479, 25.896118], [56.261108, 25.714722], [56.396912, 24.924683], [56.845276, 24.241699], [57.403503, 23.878723], [58.137085, 23.747925], [58.729309, 23.565674], [59.180481, 22.992493], [59.450073, 22.660278], [59.808105, 22.533691], [59.806274, 22.310486], [59.442322, 21.714478], [59.282471, 21.433899], [58.861084, 21.114075], [58.488098, 20.429077], [58.034302, 20.481506], [57.826477, 20.243103], [57.665894, 19.736084], [57.788696, 19.067688], [57.694519, 18.944702], [57.234314, 18.94812], [56.60968, 18.57428], [56.512329, 18.087097], [56.283508, 17.876099], [55.661499, 17.884277], [55.270081, 17.632324], [55.274902, 17.228271], [54.791077, 16.950684], [54.239319, 17.045105], [53.570496, 16.707703], [53.108704, 16.651123], [52.385315, 16.382507], [52.191711, 15.938477], [52.168274, 15.597473], [51.172485, 15.175293], [49.574707, 14.708679], [48.679321, 14.003296], [48.239075, 13.94812], [47.938904, 14.007324], [47.354492, 13.592285], [46.717102, 13.399719], [45.877686, 13.3479], [45.625122, 13.291077], [45.406494, 13.026917], [45.144287, 12.953918], [44.989685, 12.699707], [44.49469, 12.72168], [44.17511, 12.585876], [43.483093, 12.636902], [43.2229, 13.220886], [43.251526, 13.7677], [43.088074, 14.062683], [42.892273, 14.802307], [42.604919, 15.213318], [42.805115, 15.262085], [42.702515, 15.718872], [42.82373, 15.911682], [42.77948, 16.3479], [42.649719, 16.774719], [42.348083, 17.075928], [42.270874, 17.47467], [41.754517, 17.83313], [41.221497, 18.671692], [40.93927, 19.486511], [40.247681, 20.174683], [39.801697, 20.338928], [39.139526, 21.29187], [39.023682, 21.986877], [39.066284, 22.579712], [38.49292, 23.688477], [38.023926, 24.078674], [37.483704, 24.285522], [37.154907, 24.858521], [37.209473, 25.084473], [36.931702, 25.603088], [36.639709, 25.826294], [36.249084, 26.570129], [35.64032, 27.376526], [35.13031, 28.063477], [34.632324, 28.058472], [34.787903, 28.607483], [34.832275, 28.95752], [34.956116, 29.356689], [34.922729, 29.501282], [34.641724, 29.099487], [34.426697, 28.344116], [34.15448, 27.823303], [33.921509, 27.648682], [33.588074, 27.971497], [33.136902, 28.417725], [32.423279, 29.851074], [32.320496, 29.760498], [32.734924, 28.705322], [33.348877, 27.69989], [34.104675, 26.142273], [34.473877, 25.598694], [34.795105, 25.033875], [35.692505, 23.926697], [35.493713, 23.752502], [35.526123, 23.102478], [36.690674, 22.204895], [36.866272, 22.000122], [37.188721, 21.018921], [36.969482, 20.837524], [37.114685, 19.808105], [37.481873, 18.614075], [37.862671, 18.36792], [38.410095, 17.998291], [38.990723, 16.840698], [39.266113, 15.922729], [39.81427, 15.43573], [41.179321, 14.491089], [41.734924, 13.921082], [42.276917, 13.344116], [42.589722, 13.000488], [43.081299, 12.699707], [43.317871, 12.390076], [43.286499, 11.974915], [42.715881, 11.735718], [43.145325, 11.462097], [43.470703, 11.27771], [43.666687, 10.864319], [44.11792, 10.445679], [44.614319, 10.442322], [45.556885, 10.69812], [46.645508, 10.816528], [47.525696, 11.127319], [48.021729, 11.193115], [48.378906, 11.375488], [48.948303, 11.410706], [49.267883, 11.430481], [49.728699, 11.578918], [50.258911, 11.679688], [50.732117, 12.021912], [51.111328, 12.024719], [51.133911, 11.748291], [51.041504, 11.166504], [51.045288, 10.64093], [50.83429, 10.279724], [50.55249, 9.19873], [50.070923, 8.081726], [49.452698, 6.804688], [48.594482, 5.339111], [47.740906, 4.219482], [46.56488, 2.855286], [45.564087, 2.045898], [44.068298, 1.052917], [43.136108, 0.292297], [42.041687, -0.919189], [41.811096, -1.446411], [41.585083, -1.683228], [40.884888, -2.08252], [40.637878, -2.499817], [40.263123, -2.57312], [40.121277, -3.27771], [39.80011, -3.681091], [39.604919, -4.346497], [39.202271, -4.676697], [38.740479, -5.908875], [38.799683, -6.475586], [39.440125, -6.840027], [39.470093, -7.099976], [39.194702, -7.703918], [39.252075, -8.007812], [39.186523, -8.485474], [39.535889, -9.112305], [39.949707, -10.098389], [40.316711, -10.317078], [40.478516, -10.765381], [40.437317, -11.761719], [40.560913, -12.639099], [40.59967, -14.201904], [40.775513, -14.691711], [40.477295, -15.406311], [40.089294, -16.100708], [39.452698, -16.720886], [38.53833, -17.101013], [37.411072, -17.586304], [36.281311, -18.659607], [35.896484, -18.842285], [35.198486, -19.552795], [34.786499, -19.783997], [34.701904, -20.497009], [35.176086, -21.254272], [35.373474, -21.84082], [35.385925, -22.140015], [35.562683, -22.090027], [35.533875, -23.070801], [35.371887, -23.535278], [35.607483, -23.706482], [35.458679, -24.12262], [35.04071, -24.478271], [34.215881, -24.816284], [33.013306, -25.357483], [32.574707, -25.727295], [32.660278, -26.148499], [32.916077, -26.215881], [32.830078, -26.742188], [32.580322, -27.470093], [32.46228, -28.301025], [32.203491, -28.75238], [31.521118, -29.257385], [31.325684, -29.401978], [30.901672, -29.909912], [30.622925, -30.423706], [30.055725, -31.140198], [28.925476, -32.171997], [28.219727, -32.771912], [27.464722, -33.22699], [26.419495, -33.614929], [25.909729, -33.666992], [25.780701, -33.94458], [25.172913, -33.796875], [24.677917, -33.987183], [23.594116, -33.794495], [22.988281, -33.916382], [22.57428, -33.864075], [21.542908, -34.258789], [20.689087, -34.417175], [20.071289, -34.795105], [19.616516, -34.819092], [19.193298, -34.462585], [18.855286, -34.444275], [18.424683, -33.997803], [18.377502, -34.136475], [18.244507, -33.867676], [18.250122, -33.281372], [17.925293, -32.611206], [18.247925, -32.429077], [18.22168, -31.661621], [17.566895, -30.725708], [17.064514, -29.878601], [17.062927, -29.875977], [16.345093, -28.576721], [15.601929, -27.821228], [15.21051, -27.090881], [14.989685, -26.11731], [14.743286, -25.392883], [14.408081, -23.853027], [14.385681, -22.656677], [14.25769, -22.111206], [13.868713, -21.698975], [13.352478, -20.872803], [12.826904, -19.673096], [12.608704, -19.045288], [11.794922, -18.069092], [11.734314, -17.30188], [11.640076, -16.673096], [11.778687, -15.793823], [12.123718, -14.878296], [12.17572, -14.449097], [12.500122, -13.547729], [12.738525, -13.137878], [13.312927, -12.483582], [13.633728, -12.038574], [13.738708, -11.297791], [13.686523, -10.731079], [13.387329, -10.373596], [13.121094, -9.766907], [12.875488, -9.16687], [12.929077, -8.959106], [13.236511, -8.562622], [12.933105, -7.596497], [12.728271, -6.927124], [12.227478, -6.294373], [12.32251, -6.100098], [12.182312, -5.789917], [11.9151, -5.037903], [11.093689, -3.978821], [10.066284, -2.969482], [9.405273, -2.144287], [8.798096, -1.111328], [8.830078, -0.778992], [9.048523, -0.45929], [9.291321, 0.268677], [9.49292, 1.010071], [9.305725, 1.160889], [9.649292, 2.283875], [9.795288, 3.073486], [9.40448, 3.734497], [8.94812, 3.904114], [8.744873, 4.352295], [8.488892, 4.495728], [8.500305, 4.772095], [7.462097, 4.412109], [7.082703, 4.464722], [6.69812, 4.240723], [5.898315, 4.262512], [5.362915, 4.888123], [5.033691, 5.611877], [4.325684, 6.270691], [3.57428, 6.258301], [2.691711, 6.258911], [1.865295, 6.142273], [1.06012, 5.928894], [-0.507629, 5.343506], [-1.063599, 5.000488], [-1.964722, 4.71051], [-2.856079, 4.994507], [-3.311096, 4.984314], [-4.008789, 5.179871], [-4.649902, 5.168274], [-5.834412, 4.993713], [-6.528687, 4.705078], [-7.518921, 4.338318], [-7.712097, 4.364685], [-7.974121, 4.355896], [-9.004822, 4.83252], [-9.913391, 5.593689], [-10.765381, 6.140686], [-11.438782, 6.785889], [-11.708191, 6.860107], [-12.428101, 7.262878], [-12.948975, 7.798706], [-13.124023, 8.163879], [-13.246521, 8.903076], [-13.685181, 9.494873], [-14.073975, 9.886292], [-14.330078, 10.015686], [-14.579712, 10.214478], [-14.693176, 10.656311], [-14.839478, 10.876709], [-15.13031, 11.040527], [-15.664185, 11.458496], [-16.085205, 11.524719], [-16.314697, 11.806519], [-16.308899, 11.958679], [-16.61377, 12.170898], [-16.677429, 12.384888], [-16.841492, 13.151489], [-16.713684, 13.595093], [-17.126099, 14.373474], [-17.625, 14.729675], [-17.185181, 14.919495], [-16.700684, 15.621521], [-16.463013, 16.135071], [-16.549683, 16.673889], [-16.270508, 17.167114], [-16.146301, 18.108521], [-16.256897, 19.09668], [-16.377625, 19.593872], [-16.277771, 20.092529], [-16.536316, 20.567871], [-17.063416, 20.999878], [-17.020386, 21.422302], [-16.973206, 21.885681], [-16.589111, 22.158325], [-16.261902, 22.679321], [-16.326416, 23.017883], [-15.982605, 23.723511], [-15.426025, 24.359131], [-15.089294, 24.520325], [-14.824585, 25.103516], [-14.800903, 25.636292], [-14.43988, 26.254517], [-13.773804, 26.618896], [-13.139893, 27.640076], [-12.618774, 28.03833], [-11.688904, 28.148682], [-10.900879, 28.832275], [-10.399597, 29.098694], [-9.564819, 29.933716], [-9.814697, 31.177673], [-9.434814, 32.038086], [-9.30072, 32.564697], [-8.65741, 33.240295], [-7.654175, 33.697083], [-6.912476, 34.110474], [-6.244324, 35.145874], [-5.929993, 35.760071], [-5.193787, 35.75531], [-4.591003, 35.330688], [-3.640076, 35.399902], [-2.604309, 35.179077], [-2.169922, 35.168518], [-1.208618, 35.714905], [-0.12738, 35.888672], [0.503906, 36.301331], [1.466919, 36.605713], [3.161682, 36.783875], [4.815674, 36.865112], [5.320129, 36.716492], [6.261902, 37.110718], [7.330505, 37.11853], [7.737122, 36.885681], [8.421082, 36.946472], [9.510071, 37.350098], [10.210083, 37.230103], [10.180725, 36.724121], [11.028931, 37.092102], [11.100098, 36.900085], [10.600098, 36.410095], [10.593323, 35.94751], [10.939514, 35.699097], [10.807922, 34.833496], [10.149719, 34.330688], [10.339722, 33.785889], [10.856873, 33.768677], [11.108521, 33.293274], [11.488892, 33.137085], [12.66333, 32.792908], [13.083313, 32.878906], [13.918701, 32.712097], [15.245728, 32.265076], [15.713928, 31.376282], [16.611694, 31.182312], [18.021118, 30.763489], [19.086487, 30.266479], [19.574097, 30.525879], [20.053284, 30.985901], [19.820312, 31.751892], [20.134094, 32.238281], [20.854492, 32.706909], [21.543091, 32.843323], [22.895874, 32.638489], [23.236877, 32.191528], [23.609131, 32.187317], [23.92749, 32.016724], [24.921082, 31.899475], [25.164917, 31.569275], [26.4953, 31.585693], [27.457703, 31.321289], [28.4505, 31.025879], [28.913513, 30.870117], [29.683472, 31.18689], [30.095093, 31.473511], [30.976929, 31.555908], [31.68811, 31.429688], [31.96051, 30.933716], [32.192505, 31.260315], [32.993896, 31.024109], [33.773499, 30.967529], [34.265503, 31.219482], [34.556519, 31.548889], [34.488098, 31.60553], [34.752686, 32.072876], [34.955505, 32.827515], [35.098511, 33.080688], [35.126099, 33.090881], [35.4823, 33.905518], [35.979675, 34.610107], [35.998474, 34.644897], [35.90509, 35.410095], [36.149902, 35.821472], [35.782104, 36.275085], [36.160889, 36.650696], [35.551086, 36.565491], [34.714478, 36.795471], [34.026917, 36.220093], [32.509277, 36.107483], [31.699707, 36.644287], [30.621704, 36.677917], [30.391113, 36.263123], [29.700073, 36.144287], [28.73291, 36.67688], [27.641296, 36.658875], [27.048889, 37.653503], [26.318298, 38.20813], [26.804688, 38.985901], [26.170898, 39.463684], [27.28009, 40.420105], [28.820129, 40.460083], [29.240112, 41.220093], [31.145874, 41.087708], [32.348083, 41.736328], [33.513306, 42.019104], [35.167725, 42.040283], [36.913086, 41.33551], [38.347717, 40.94873], [39.512695, 41.102905], [40.373474, 41.013672], [41.554077, 41.535706], [41.703308, 41.963074], [41.453491, 42.645081], [40.875488, 43.013672], [40.321472, 43.128723], [39.955078, 43.43512], [38.680115, 44.28009], [37.539124, 44.657288], [36.675476, 45.24469], [37.40332, 45.40448], [38.233093, 46.240906], [37.673706, 46.636719], [39.147705, 47.044678], [39.121277, 47.263489], [38.223694, 47.102295], [37.42511, 47.022278], [36.759888, 46.69873], [35.82373, 46.645874], [34.96228, 46.273315], [35.020874, 45.651306], [35.510071, 45.410095], [36.53009, 45.470093], [36.334717, 45.113281], [35.240112, 44.940125], [33.882507, 44.361511], [33.326477, 44.56488], [33.546875, 45.034912], [32.454285, 45.327515], [32.63092, 45.519287], [33.588074, 45.851685], [33.298706, 46.080688], [31.74408, 46.333496], [31.675293, 46.706299], [30.748901, 46.58313], [30.377686, 46.032471], [29.603271, 45.293274], [29.626526, 45.035522], [29.141724, 44.820312], [28.837891, 44.913879], [28.558105, 43.70752], [28.039124, 43.293274], [27.673889, 42.577881], [27.996704, 42.007507], [28.115479, 41.622925], [28.988525, 41.299927], [28.806519, 41.054871], [27.61908, 40.999878], [27.192505, 40.690674], [26.358093, 40.1521], [26.043274, 40.617676], [26.056885, 40.824097], [25.447693, 40.852478], [24.925903, 40.947083], [23.714905, 40.687073], [24.408081, 40.125122], [23.900085, 39.962097], [23.343079, 39.961121], [22.814087, 40.476074], [22.626282, 40.256531], [22.84967, 39.659302], [23.350098, 39.190125], [22.973083, 38.970886], [23.53009, 38.510071], [24.025085, 38.220093], [24.0401, 37.65509], [23.115112, 37.920105], [23.410095, 37.410095], [22.775085, 37.305115], [23.154297, 36.422485], [22.490112, 36.410095], [21.670105, 36.845093], [21.295105, 37.645081], [21.120117, 38.310303], [20.730103, 38.770081], [20.217712, 39.340271], [20.150085, 39.625122], [19.980103, 39.695129], [19.960083, 39.9151], [19.406128, 40.250916], [19.319092, 40.727295], [19.403687, 41.409485], [19.5401, 41.720093], [19.371887, 41.877686], [19.162476, 41.955078], [18.88208, 42.281494], [18.450073, 42.480103], [17.509888, 42.850098], [16.930115, 43.210083], [16.015503, 43.507324], [15.1745, 44.243286], [15.376282, 44.317871], [14.920288, 44.738525], [14.901672, 45.076111], [14.258728, 45.233887], [13.952271, 44.802124], [13.657104, 45.137085], [13.679504, 45.484131], [13.715088, 45.500305], [13.937683, 45.591125], [13.141724, 45.736694], [12.328674, 45.381897], [12.383911, 44.885498], [12.261475, 44.600525], [12.589294, 44.091492], [13.526917, 43.587708], [14.029907, 42.761108], [15.1427, 41.955078], [15.926331, 41.961304], [16.169922, 41.740295], [15.889282, 41.541077], [16.785095, 41.179688], [17.519287, 40.877075], [18.376709, 40.355713], [18.480286, 40.168884], [18.293518, 39.810913], [17.738525, 40.27771], [16.86969, 40.442322], [16.44873, 39.795471], [17.171509, 39.424683], [17.052917, 38.902893], [16.635071, 38.843689], [16.101074, 37.985901], [15.684082, 37.908875], [15.68811, 38.214722], [15.89209, 38.750916], [16.109314, 38.964478], [15.718872, 39.544128], [15.413696, 40.048279], [14.998474, 40.173096], [14.703308, 40.604675], [14.06073, 40.786499], [13.628113, 41.188293], [12.888123, 41.253113], [12.106689, 41.704529], [11.191895, 42.35553], [10.512085, 42.931519], [10.200073, 43.920105], [9.702515, 44.036316], [8.888916, 44.366272], [8.428711, 44.231323], [7.850891, 43.767273], [7.435303, 43.693909], [6.529297, 43.128906], [4.556885, 43.399719], [3.100525, 43.075317], [2.986084, 42.473083], [3.03949, 41.89209], [2.091919, 41.226074], [0.810486, 41.014709], [0.721313, 40.678284], [0.106689, 40.124084], [-0.278687, 39.31012], [0.111328, 38.738525], [-0.467102, 38.29248], [-0.683411, 37.642273], [-1.438293, 37.443115], [-2.146423, 36.674072], [-3.41571, 36.658875], [-4.368896, 36.677917], [-4.995178, 36.324707], [-5.377075, 35.946899], [-5.866394, 36.029907], [-6.236694, 36.367676], [-6.520203, 36.942871], [-7.453674, 37.0979], [-7.855591, 36.838318], [-8.382812, 36.978882], [-8.898804, 36.868896], [-8.746094, 37.651489], [-8.840027, 38.266296], [-9.287476, 38.358521], [-9.526489, 38.737488], [-9.446899, 39.39209], [-9.048279, 39.755127], [-8.977295, 40.159302], [-8.768677, 40.760681], [-8.790771, 41.184326], [-8.990784, 41.543518], [-9.03479, 41.880676], [-8.984375, 42.592896], [-9.392883, 43.026672], [-7.97821, 43.748474], [-6.754517, 43.567871], [-5.411804, 43.57428], [-4.347778, 43.403503], [-3.517517, 43.455872], [-1.901306, 43.422913], [-1.384216, 44.022705], [-1.193787, 46.014893], [-2.225708, 47.064514], [-2.963196, 47.570312], [-4.491577, 47.955078], [-4.592285, 48.684082], [-3.295776, 48.901672], [-1.616516, 48.64447], [-1.933411, 49.776489], [-0.98938, 49.347473], [1.338684, 50.127319], [1.639099, 50.946716], [2.513489, 51.148499], [3.315125, 51.345886], [3.830322, 51.620483], [4.706116, 53.091919], [6.07428, 53.510498], [6.905273, 53.4823], [7.100525, 53.693909], [7.936279, 53.748291], [8.121704, 53.527893], [8.80072, 54.020874], [8.572083, 54.395691], [8.526306, 54.962891], [8.1203, 55.5177], [8.090088, 56.5401], [8.256714, 56.81012], [8.543518, 57.110107], [9.4245, 57.172119], [9.775696, 57.447876], [10.580078, 57.730103], [10.546082, 57.215881], [10.250122, 56.890076], [10.370117, 56.610107], [10.912292, 56.458679], [10.667908, 56.081482], [10.370117, 56.190125], [9.650085, 55.470093], [9.921875, 54.983093], [9.939697, 54.59668], [10.950073, 54.363708], [10.939514, 54.008728], [11.956299, 54.196472], [12.518494, 54.47052], [13.647522, 54.0755], [14.11969, 53.75708], [14.802917, 54.05072], [16.363525, 54.513306], [17.622925, 54.851685], [18.620911, 54.682678], [18.696289, 54.438721], [19.660706, 54.426086], [19.888489, 54.866089], [21.268494, 55.190491], [21.055908, 56.031128], [21.090515, 56.783875], [21.581909, 57.411926], [22.524475, 57.753479], [23.318481, 57.006287], [24.120728, 57.025696], [24.312927, 57.793518], [24.429077, 58.383484], [24.061279, 58.257507], [23.426697, 58.612671], [23.339905, 59.187317], [24.604309, 59.465881], [25.864319, 59.611084], [26.94928, 59.445923], [27.981079, 59.475525], [29.117676, 60.028076], [28.070129, 60.503479], [26.25531, 60.423889], [24.496704, 60.057312], [22.86969, 59.846497], [22.290894, 60.391907], [21.322327, 60.720276], [21.544922, 61.705322], [21.059326, 62.607483], [21.536072, 63.18988], [22.442688, 63.817871], [24.73053, 64.902283], [25.398071, 65.111511], [25.294128, 65.534485], [23.903503, 66.006897], [22.183289, 65.723877], [21.213501, 65.026123], [21.36969, 64.413696], [19.778931, 63.60968], [17.8479, 62.749512], [17.11969, 61.341309], [17.831482, 60.636719], [18.78772, 60.081909], [17.869324, 58.953918], [16.829285, 58.71991], [16.447693, 57.041077], [15.879883, 56.104309], [14.666687, 56.200928], [14.100708, 55.407898], [12.942871, 55.361877], [12.625122, 56.307129], [11.788086, 57.441895], [11.027283, 58.856079], [10.356689, 59.46991], [8.38208, 58.313293], [7.048889, 58.078918], [5.665894, 58.588074], [5.308289, 59.66333], [4.992126, 61.97113], [5.912903, 62.614502], [8.553528, 63.454102], [10.52771, 64.486084], [12.358276, 65.8797], [14.761292, 67.81073], [16.435913, 68.563293], [19.184082, 69.817505], [21.378479, 70.25531], [23.023682, 70.202087], [24.546692, 71.030518], [26.370117, 70.986328], [28.165527, 71.185486], [31.293518, 70.453918], [30.005493, 70.186279], [31.101074, 69.558105], [32.13269, 69.905884], [33.775513, 69.301514], [36.514099, 69.063477], [40.29248, 67.932495], [41.059875, 67.457275], [41.126099, 66.791687], [40.01593, 66.266296], [38.382874, 65.999512], [33.918701, 66.759705], [33.184509, 66.632507], [34.81488, 65.900085], [34.943909, 64.41449], [36.231323, 64.109497], [37.012878, 63.849915], [37.14209, 64.334717], [36.5177, 64.780273], [37.176086, 65.143311], [39.593506, 64.520874], [40.43573, 64.764526], [39.762695, 65.496887], [42.093079, 66.476318], [43.016113, 66.418701], [43.94989, 66.069092], [44.532288, 66.756287], [43.698486, 67.352478], [44.187927, 67.9505], [43.452881, 68.570923], [46.250122, 68.250122], [46.821289, 67.68988], [45.555298, 67.566528], [45.562073, 67.010071], [46.349121, 66.667725], [47.894287, 66.884521], [48.138672, 67.522522], [50.227722, 67.998718], [53.717529, 68.857483], [54.47168, 68.808289], [53.485901, 68.201294], [54.726318, 68.097107], [55.442688, 68.438721], [57.317078, 68.466309], [58.802124, 68.88092], [59.941528, 68.278503], [61.077881, 68.940674], [60.03009, 69.520081], [60.55011, 69.850098], [63.504089, 69.547485], [64.888123, 69.234924], [68.512085, 68.092285], [69.180725, 68.615723], [68.16449, 69.144287], [68.135315, 69.356506], [66.930115, 69.454712], [67.259888, 69.928711], [66.724915, 70.708923], [66.694702, 71.029114], [68.5401, 71.934509], [69.196289, 72.843506], [69.940125, 73.0401], [72.587524, 72.776306], [72.796082, 72.220093], [71.848083, 71.409119], [72.470093, 71.090271], [72.79187, 70.391113], [72.564697, 69.020874], [73.667908, 68.407898], [73.238708, 67.740479], [71.28009, 66.320129], [72.423096, 66.172729], [72.820679, 66.532715], [73.921082, 66.78949], [74.186523, 67.284302], [75.052124, 67.760498], [74.469299, 68.329102], [74.935913, 68.989319], [73.842285, 69.071472], [73.601929, 69.627686], [74.399902, 70.631897], [73.101074, 71.447083], [74.89093, 72.121277], [74.659302, 72.832275], [75.158081, 72.855103], [75.683472, 72.300476], [75.289124, 71.335693], [76.359131, 71.152893], [75.903076, 71.874084], [77.576721, 72.267273], [79.6521, 72.320129], [81.500122, 71.750122], [80.610718, 72.582886], [80.511108, 73.648315], [82.250122, 73.850098], [84.655273, 73.805908], [86.822327, 73.93689], [86.009705, 74.459717], [87.16687, 75.116516], [88.315674, 75.143921], [90.260071, 75.640076], [92.900696, 75.773315], [93.234314, 76.047302], [95.860107, 76.140076], [96.678284, 75.915527], [98.922485, 76.446899], [100.759705, 76.430298], [101.035278, 76.861877], [101.990906, 77.287476], [104.351685, 77.697876], [106.066711, 77.373901], [104.705078, 77.127502], [106.970276, 76.974304]], [[49.110291, 41.282288], [49.618896, 40.572876], [50.0849, 40.526306], [50.392883, 40.256531], [49.569275, 40.176086], [49.395325, 39.399475], [49.223328, 39.049316], [48.856506, 38.815491], [48.883301, 38.320313], [49.199707, 37.582886], [50.147888, 37.374695], [50.842285, 36.872925], [52.264099, 36.7005], [53.825928, 36.965088], [53.921692, 37.198914], [53.735474, 37.906128], [53.88092, 38.952087], [53.101074, 39.29071], [53.35791, 39.975281], [52.694092, 40.033691], [52.915283, 40.876526], [53.858276, 40.631104], [54.736877, 40.951111], [54.008301, 41.551331], [53.72168, 42.123291], [52.916687, 41.868103], [52.814697, 41.135498], [52.502502, 41.783325], [52.446289, 42.027283], [52.692078, 42.443909], [52.501526, 42.792297], [51.342529, 43.133118], [50.891296, 44.031128], [50.339111, 44.284119], [50.305725, 44.609924], [51.278503, 44.514893], [51.316895, 45.246094], [52.16748, 45.408508], [53.040894, 45.259094], [53.220886, 46.23468], [53.042725, 46.853088], [52.042114, 46.804687], [51.192078, 47.048706], [50.034119, 46.609131], [49.101318, 46.399475], [48.645508, 45.806274], [47.675903, 45.641479], [46.682129, 44.609314], [47.590881, 43.660278], [47.492493, 42.986694], [48.584473, 41.808899], [49.110291, 41.282288]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [-96.436304, 77.491343, -93.720656, 77.834629], geometry: { type: "Polygon", coordinates: [[[-93.840003, 77.519997], [-94.295608, 77.491343], [-96.169654, 77.555111], [-96.436304, 77.834629], [-94.422577, 77.820005], [-93.720656, 77.634331], [-93.840003, 77.519997]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-113.534279, 77.409229, -109.854452, 78.152956], geometry: { type: "Polygon", coordinates: [[[-110.186938, 77.697015], [-112.051191, 77.409229], [-113.534279, 77.732207], [-112.724587, 78.05105], [-111.264443, 78.152956], [-109.854452, 77.996325], [-110.186938, 77.697015]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [20.72601, 77.44493, 24.72412, 78.45494], geometry: { type: "Polygon", coordinates: [[[24.72412, 77.85385], [22.49032, 77.44493], [20.72601, 77.67704], [21.41611, 77.93504], [20.8119, 78.25463], [22.88426, 78.45494], [23.28134, 78.07954], [24.72412, 77.85385]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1.5 }, bbox: [-112.542091, 78.40692, -109.663146, 78.849994], geometry: { type: "Polygon", coordinates: [[[-109.663146, 78.601973], [-110.881314, 78.40692], [-112.542091, 78.407902], [-112.525891, 78.550555], [-111.50001, 78.849994], [-110.963661, 78.804441], [-109.663146, 78.601973]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [-98.631984, 77.850597, -95.559278, 78.87193], geometry: { type: "Polygon", coordinates: [[[-95.830295, 78.056941], [-97.309843, 77.850597], [-98.124289, 78.082857], [-98.552868, 78.458105], [-98.631984, 78.87193], [-97.337231, 78.831984], [-96.754399, 78.765813], [-95.559278, 78.418315], [-95.830295, 78.056941]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 0.5 }, bbox: [-105.492289, 77.907545, -99.670939, 79.301594], geometry: { type: "Polygon", coordinates: [[[-100.060192, 78.324754], [-99.670939, 77.907545], [-101.30394, 78.018985], [-102.949809, 78.343229], [-105.176133, 78.380332], [-104.210429, 78.67742], [-105.41958, 78.918336], [-105.492289, 79.301594], [-103.529282, 79.165349], [-100.825158, 78.800462], [-100.060192, 78.324754]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0.5 }, bbox: [99.43814, 77.921, 105.37243, 79.34641], geometry: { type: "Polygon", coordinates: [[[105.07547, 78.30689], [99.43814, 77.921], [101.2649, 79.23399], [102.08635, 79.34641], [102.837815, 79.28129], [105.37243, 78.71334], [105.07547, 78.30689]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [10.44453, 76.77045, 21.54383, 80.05086], geometry: { type: "Polygon", coordinates: [[[18.25183, 79.70175], [21.54383, 78.95611], [19.02737, 78.5626], [18.47172, 77.82669], [17.59441, 77.63796], [17.1182, 76.80941], [15.91315, 76.77045], [13.76259, 77.38035], [14.66956, 77.73565], [13.1706, 78.02493], [11.22231, 78.8693], [10.44453, 79.65239], [13.17077, 80.01046], [13.71852, 79.66039], [15.14282, 79.67431], [15.52255, 80.01608], [16.99085, 80.05086], [18.25183, 79.70175]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [17.368015, 79.400012, 27.407506, 80.657144], geometry: { type: "Polygon", coordinates: [[[25.447625, 80.40734], [27.407506, 80.056406], [25.924651, 79.517834], [23.024466, 79.400012], [20.075188, 79.566823], [19.897266, 79.842362], [18.462264, 79.85988], [17.368015, 80.318896], [20.455992, 80.598156], [21.907945, 80.357679], [22.919253, 80.657144], [25.447625, 80.40734]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1 }, bbox: [44.846958, 80.010181, 51.522933, 80.918885], geometry: { type: "Polygon", coordinates: [[[51.136187, 80.54728], [49.793685, 80.415428], [48.894411, 80.339567], [48.754937, 80.175468], [47.586119, 80.010181], [46.502826, 80.247247], [47.072455, 80.559424], [44.846958, 80.58981], [46.799139, 80.771918], [48.318477, 80.78401], [48.522806, 80.514569], [49.09719, 80.753986], [50.039768, 80.918885], [51.522933, 80.699726], [51.136187, 80.54728]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [91.18107, 78.7562, 100.186655, 81.2504], geometry: { type: "Polygon", coordinates: [[[99.93976, 78.88094], [97.75794, 78.7562], [94.97259, 79.044745], [93.31288, 79.4265], [92.5454, 80.14379], [91.18107, 80.34146], [93.77766, 81.0246], [95.940895, 81.2504], [97.88385, 80.746975], [100.186655, 79.780135], [99.93976, 78.88094]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-96.70972, 78.21533, -85.81435, 81.25739], geometry: { type: "Polygon", coordinates: [[[-87.02, 79.66], [-85.81435, 79.3369], [-87.18756, 79.0393], [-89.03535, 78.28723], [-90.80436, 78.21533], [-92.87669, 78.34333], [-93.95116, 78.75099], [-93.93574, 79.11373], [-93.14524, 79.3801], [-94.974, 79.37248], [-96.07614, 79.70502], [-96.70972, 80.15777], [-96.01644, 80.60233], [-95.32345, 80.90729], [-94.29843, 80.97727], [-94.73542, 81.20646], [-92.40984, 81.25739], [-91.13289, 80.72345], [-89.45, 80.509322], [-87.81, 80.32], [-87.02, 79.66]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-91.58702, 76.17812, -61.85, 83.23324], geometry: { type: "Polygon", coordinates: [[[-68.5, 83.106322], [-65.82735, 83.02801], [-63.68, 82.9], [-61.85, 82.6286], [-61.89388, 82.36165], [-64.334, 81.92775], [-66.75342, 81.72527], [-67.65755, 81.50141], [-65.48031, 81.50657], [-67.84, 80.9], [-69.4697, 80.61683], [-71.18, 79.8], [-73.2428, 79.63415], [-73.88, 79.430162], [-76.90773, 79.32309], [-75.52924, 79.19766], [-76.22046, 79.01907], [-75.39345, 78.52581], [-76.34354, 78.18296], [-77.88851, 77.89991], [-78.36269, 77.50859], [-79.75951, 77.20968], [-79.61965, 76.98336], [-77.91089, 77.022045], [-77.88911, 76.777955], [-80.56125, 76.17812], [-83.17439, 76.45403], [-86.11184, 76.29901], [-87.6, 76.42], [-89.49068, 76.47239], [-89.6161, 76.95213], [-87.76739, 77.17833], [-88.26, 77.9], [-87.65, 77.970222], [-84.97634, 77.53873], [-86.34, 78.18], [-87.96192, 78.37181], [-87.15198, 78.75867], [-85.37868, 78.9969], [-85.09495, 79.34543], [-86.50734, 79.73624], [-86.93179, 80.25145], [-84.19844, 80.20836], [-83.408696, 80.1], [-81.84823, 80.46442], [-84.1, 80.58], [-87.59895, 80.51627], [-89.36663, 80.85569], [-90.2, 81.26], [-91.36786, 81.5531], [-91.58702, 81.89429], [-90.1, 82.085], [-88.93227, 82.11751], [-86.97024, 82.27961], [-85.5, 82.652273], [-84.260005, 82.6], [-83.18, 82.32], [-82.42, 82.86], [-81.1, 83.02], [-79.30664, 83.13056], [-76.25, 83.172059], [-75.71878, 83.06404], [-72.83153, 83.23324], [-70.665765, 83.169781], [-68.5, 83.106322]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 0, min_zoom: 0 }, bbox: [-73.297, 60.03676, -12.20855, 83.64513], geometry: { type: "Polygon", coordinates: [[[-27.10046, 83.51966], [-20.84539, 82.72669], [-22.69182, 82.34165], [-26.51753, 82.29765], [-31.9, 82.2], [-31.39646, 82.02154], [-27.85666, 82.13178], [-24.84448, 81.78697], [-22.90328, 82.09317], [-22.07175, 81.73449], [-23.16961, 81.15271], [-20.62363, 81.52462], [-15.76818, 81.91245], [-12.77018, 81.71885], [-12.20855, 81.29154], [-16.28533, 80.58004], [-16.85, 80.35], [-20.04624, 80.17708], [-17.73035, 80.12912], [-18.9, 79.4], [-19.70499, 78.75128], [-19.67353, 77.63859], [-18.47285, 76.98565], [-20.03503, 76.94434], [-21.67944, 76.62795], [-19.83407, 76.09808], [-19.59896, 75.24838], [-20.66818, 75.15585], [-19.37281, 74.29561], [-21.59422, 74.22382], [-20.43454, 73.81713], [-20.76234, 73.46436], [-22.17221, 73.30955], [-23.56593, 73.30663], [-22.31311, 72.62928], [-22.29954, 72.18409], [-24.27834, 72.59788], [-24.79296, 72.3302], [-23.44296, 72.08016], [-22.13281, 71.46898], [-21.75356, 70.66369], [-23.53603, 70.471], [-24.30702, 70.85649], [-25.54341, 71.43094], [-25.20135, 70.75226], [-26.36276, 70.22646], [-23.72742, 70.18401], [-22.34902, 70.12946], [-25.02927, 69.2588], [-27.74737, 68.47046], [-30.67371, 68.12503], [-31.77665, 68.12078], [-32.81105, 67.73547], [-34.20196, 66.67974], [-36.35284, 65.9789], [-37.04378, 65.93768], [-38.37505, 65.69213], [-39.81222, 65.45848], [-40.66899, 64.83997], [-40.68281, 64.13902], [-41.1887, 63.48246], [-42.81938, 62.68233], [-42.41666, 61.90093], [-42.86619, 61.07404], [-43.3784, 60.09772], [-44.7875, 60.03676], [-46.26364, 60.85328], [-48.26294, 60.85843], [-49.23308, 61.40681], [-49.90039, 62.38336], [-51.63325, 63.62691], [-52.14014, 64.27842], [-52.27659, 65.1767], [-53.66166, 66.09957], [-53.30161, 66.8365], [-53.96911, 67.18899], [-52.9804, 68.35759], [-51.47536, 68.72958], [-51.08041, 69.14781], [-50.87122, 69.9291], [-52.013585, 69.574925], [-52.55792, 69.42616], [-53.45629, 69.283625], [-54.68336, 69.61003], [-54.75001, 70.28932], [-54.35884, 70.821315], [-53.431315, 70.835755], [-51.39014, 70.56978], [-53.10937, 71.20485], [-54.00422, 71.54719], [-55, 71.406537], [-55.83468, 71.65444], [-54.71819, 72.58625], [-55.32634, 72.95861], [-56.12003, 73.64977], [-57.32363, 74.71026], [-58.59679, 75.09861], [-58.58516, 75.51727], [-61.26861, 76.10238], [-63.39165, 76.1752], [-66.06427, 76.13486], [-68.50438, 76.06141], [-69.66485, 76.37975], [-71.40257, 77.00857], [-68.77671, 77.32312], [-66.76397, 77.37595], [-71.04293, 77.63595], [-73.297, 78.04419], [-73.15938, 78.43271], [-69.37345, 78.91388], [-65.7107, 79.39436], [-65.3239, 79.75814], [-68.02298, 80.11721], [-67.15129, 80.51582], [-63.68925, 81.21396], [-62.23444, 81.3211], [-62.65116, 81.77042], [-60.28249, 82.03363], [-57.20744, 82.19074], [-54.13442, 82.19962], [-53.04328, 81.88833], [-50.39061, 82.43883], [-48.00386, 82.06481], [-46.59984, 81.985945], [-44.523, 81.6607], [-46.9007, 82.19979], [-46.76379, 82.62796], [-43.40644, 83.22516], [-39.89753, 83.18018], [-38.62214, 83.54905], [-35.08787, 83.64513], [-27.10046, 83.51966]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "malta", name_zh: "\u9A6C\u8033\u4ED6", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[14.566211, 35.852734], [14.532715, 35.820215], [14.436426, 35.82168], [14.352344, 35.872266], [14.35127, 35.978418], [14.44834, 35.957422], [14.537012, 35.886279], [14.566211, 35.852734]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "rhodes", name_zh: "\u7F57\u5F97\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[27.842773, 35.929297], [27.770605, 35.908301], [27.745703, 35.911035], [27.715527, 35.957324], [27.757324, 36.069189], [27.718652, 36.141113], [27.716309, 36.171582], [27.774414, 36.21377], [27.815234, 36.276953], [27.914453, 36.345312], [28.171484, 36.426221], [28.231836, 36.433643], [28.230078, 36.370264], [28.144043, 36.209863], [28.067676, 36.129687], [28.087793, 36.065332], [27.965527, 36.04751], [27.842773, 35.929297]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "madeira", name_zh: "\u9A6C\u5FB7\u62C9\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[-17.190869, 32.868604], [-17.054492, 32.815869], [-16.929199, 32.841406], [-16.773975, 32.773535], [-16.693262, 32.758008], [-16.765283, 32.709717], [-16.837402, 32.648291], [-17.018262, 32.662793], [-17.171191, 32.721875], [-17.226025, 32.766846], [-17.241016, 32.807373], [-17.190869, 32.868604]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "sao-miguel", name_zh: "\u4E9A\u901F\u5C14\u5723\u7C73\u683C\u5C14\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[-25.648975, 37.840918], [-25.585498, 37.834033], [-25.266602, 37.848633], [-25.181934, 37.837891], [-25.190723, 37.764355], [-25.251123, 37.73501], [-25.439014, 37.715332], [-25.734473, 37.762891], [-25.833691, 37.826074], [-25.847852, 37.872412], [-25.845898, 37.894043], [-25.78374, 37.911133], [-25.648975, 37.840918]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "okinawa", name_zh: "\u51B2\u7EF3\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[128.258789, 26.652783], [128.1625, 26.606934], [128.126953, 26.552246], [128.037891, 26.533594], [127.95127, 26.456494], [127.86709, 26.44248], [127.869238, 26.380566], [127.904785, 26.328125], [127.84873, 26.318945], [127.790137, 26.255078], [127.785547, 26.208691], [127.806445, 26.17124], [127.803613, 26.152539], [127.729395, 26.097168], [127.653125, 26.094727], [127.649707, 26.154492], [127.654883, 26.19917], [127.727051, 26.30791], [127.728906, 26.433936], [127.795898, 26.448535], [127.82041, 26.466064], [127.925977, 26.555713], [127.945508, 26.593945], [127.89082, 26.631055], [127.894824, 26.674951], [127.907227, 26.693604], [127.994336, 26.679443], [128.029688, 26.646875], [128.046777, 26.643311], [128.097656, 26.667773], [128.121582, 26.711426], [128.216504, 26.796875], [128.254883, 26.881885], [128.331641, 26.812109], [128.310938, 26.720703], [128.258789, 26.652783]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "zanzibar", name_zh: "\u6851\u7ED9\u5DF4\u5C14\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[39.496484, -6.174609], [39.573047, -6.387402], [39.563184, -6.427246], [39.50918, -6.45166], [39.480957, -6.453711], [39.447363, -6.419727], [39.423633, -6.347852], [39.382617, -6.364941], [39.312695, -6.279102], [39.243457, -6.275], [39.182324, -6.172559], [39.20625, -6.083203], [39.192383, -5.931055], [39.266992, -5.853125], [39.308984, -5.721973], [39.357227, -5.811523], [39.368262, -5.951172], [39.433301, -6.11543], [39.487891, -6.166211], [39.496484, -6.174609]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "mauritius", name_zh: "\u6BDB\u91CC\u6C42\u65AF\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[57.65127, -20.484863], [57.524805, -20.513184], [57.383301, -20.503711], [57.32832, -20.45], [57.317676, -20.427637], [57.365137, -20.406445], [57.362109, -20.337598], [57.385742, -20.228613], [57.416016, -20.183789], [57.486426, -20.143945], [57.515039, -20.055957], [57.575781, -19.997168], [57.656543, -19.989941], [57.737207, -20.098438], [57.791992, -20.212598], [57.780664, -20.326953], [57.725, -20.368848], [57.706641, -20.434863], [57.65127, -20.484863]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "reunion", name_zh: "\u7559\u5C3C\u6C6A\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[55.797363, -21.339355], [55.656152, -21.369043], [55.557617, -21.358301], [55.362695, -21.273633], [55.310352, -21.217383], [55.232813, -21.058398], [55.25, -21.002441], [55.311328, -20.904102], [55.450488, -20.865137], [55.596484, -20.87959], [55.661914, -20.90625], [55.73916, -21.021484], [55.839063, -21.138574], [55.822461, -21.277832], [55.797363, -21.339355]]] } }, { type: "Feature", properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: "jeju", name_zh: "\u6D4E\u5DDE\u5C9B", source: "Natural Earth 1:50m land" }, geometry: { type: "Polygon", coordinates: [[[126.326953, 33.223633], [126.282031, 33.201514], [126.240234, 33.214844], [126.229004, 33.225244], [126.178711, 33.282568], [126.165625, 33.312012], [126.199414, 33.368066], [126.337695, 33.4604], [126.695508, 33.549316], [126.759863, 33.553223], [126.901172, 33.515137], [126.93125, 33.443848], [126.905371, 33.382373], [126.872852, 33.341162], [126.70918, 33.27168], [126.581738, 33.23833], [126.326953, 33.223633]]] } }], bbox: [-180, -90, 180, 83.64513] };

// <stdin>
initializeNavigationGeography(land_default);
export {
  TradeSim,
  advanceNavigation,
  createMarketEvent,
  createNavigation,
  distanceDegrees,
  eras,
  goods,
  initializeNavigationGeography,
  inlandCities,
  inlandRoads,
  isLandPoint,
  majorPorts,
  marketEventFactor,
  navigationHazards,
  origins,
  planSeaRoute,
  portPoint,
  ports,
  readNavigation
};
