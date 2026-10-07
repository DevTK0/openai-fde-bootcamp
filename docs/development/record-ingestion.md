# Manage records in each workspace

This local prototype keeps dataset tools in Fleet overview, Maintenance, Operations, Workshop & planning, Passenger reports, and Cost options. Each workspace contains its own source tables, search, exports, and record controls. The standalone Data Explorer and Relationships screens have been removed.

## Start a local preview

Use the repository's Node and pnpm versions.

1. Run `pnpm install`.
2. Create an isolated database copy:

   ```bash
   mkdir -p .audit
   cp data/operations/lionlink-network.sqlite .audit/ingestion.sqlite
   ```

3. Start the app:

   ```bash
   DASHBOARD_DATABASE_PATH="$PWD/.audit/ingestion.sqlite" \
     RECORD_IMPORTS_ENABLED=1 pnpm --filter web dev
   ```

4. Open the printed HTTPS preview URL and select a workspace.
5. Select a dataset tab in its records section. Use **Upload new records**, beside **Export CSV**, to download a template and upload a CSV. Review the sample, then select **Add new records** to save the batch.
6. Use **Add record** to enter an individual record. Required fields are marked with an asterisk.
7. Use **Remove** on a row, review its identity and values, then confirm the removal or cancel.
8. Refresh the dashboard to check persistence.

All 40 handout datasets and 21 operations datasets support these controls. The dashboards omit documentation panels, source-file labels, and explanatory banners. Dataset tabs show one table at a time. Workspace charts remain above the records, while automatic per-dataset charts are removed. Fleet repair spending has selected-period and annual-comparison tabs. Use **View** on a row to read every field in full. All tables use compact rows and the same search, field filter, sortable columns, and 25-row pagination. Select a column under **Filter by**, then choose **Contains**, **Equals**, or **Is blank**. Search and field filters combine. **Reset** clears search, filters, and sorting. CSV exports contain every matching row in the selected order, across all pages, including saved additions and removals. Dataset controls do not change the workspace summary charts. Operations summary tables use the same controls and remain read-only.

## Record behavior

Uploads append records. They never replace an existing record. CSV files can contain up to 1,000 records and 2 MB. Column order can change, but every column must be present with its exact name. Numeric fields require numbers; text identifiers retain leading zeros. Quoted commas, multiline text, and UTF-8 byte-order marks are supported.

The server discovers dataset columns from SQLite metadata. `dataset-rules.ts` defines additional identifying and required fields. CSV uploads and individual additions use the same validation and transactional writes. A rejected row rolls back the batch. Preview rolls back its transaction; confirmation validates again before committing.

Removals use the stored handout position or operations rowid and compare the displayed values with the saved record. A stale record is rejected. A removal does not cascade into other datasets. Numeric handout field types are retained when the final row is removed.

Successful changes refresh records and dashboard reports. Fleet and maintenance totals use the monthly ledger, so adding a repair detail does not count the same expense twice. Passenger reports do not automatically gain links to operating trips. Reports with removed trip-origin evidence omit that missing match.

Run `pnpm check` for repository checks. The dataset verification uses isolated database copies to add and remove a record in every dataset, preserve existing contents, reject duplicate additions and stale removals, and check empty dataset field types.

Writes are disabled unless `RECORD_IMPORTS_ENABLED=1`. This remains a disposable local prototype without authentication, a permission model, or complete cross-record business validation. It does not implement record editing, workbook parsing, or batch history.
