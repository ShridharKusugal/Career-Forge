USE careerforge_db;

-- Clean existing coding problems above default
DELETE FROM coding_problems WHERE id > 2;

-- Helper variables for company IDs
SET @google_id = (SELECT id FROM companies WHERE name='Google' LIMIT 1);
SET @amazon_id = (SELECT id FROM companies WHERE name='Amazon' LIMIT 1);
SET @microsoft_id = (SELECT id FROM companies WHERE name='Microsoft' LIMIT 1);
SET @meta_id = (SELECT id FROM companies WHERE name='Meta' LIMIT 1);
SET @netflix_id = (SELECT id FROM companies WHERE name='Netflix' LIMIT 1);
SET @apple_id = (SELECT id FROM companies WHERE name='Apple' LIMIT 1);

-- 1. Two Sum (Updated metadata)
UPDATE coding_problems SET 
    company_id = @google_id,
    topic_tags = 'Arrays, HashMap',
    time_complexity = 'O(N)',
    space_complexity = 'O(N)',
    hints = '["Use a HashMap to store values you have seen so far.","For each value x, check if target - x is already in the map."]',
    solution_explanation = 'An optimal single-pass solution utilizes a HashMap. As we scan the array, we check if the complement (target - current_value) exists in the map. If yes, we return their indices. Otherwise, we insert the current value and index into the map.',
    starter_code = 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    \n}}'
WHERE title = 'Two Sum';

-- 2. Reverse Linked List (Updated metadata)
UPDATE coding_problems SET 
    company_id = @microsoft_id,
    topic_tags = 'Linked List',
    time_complexity = 'O(N)',
    space_complexity = 'O(1)',
    hints = '["Maintain prev, curr, and next pointers.","At each step, point curr.next to prev, then advance pointers."]',
    solution_explanation = 'Iterate through the linked list. In each step, capture curr.next in a temporary pointer. Point curr.next to prev, then move prev to curr, and curr to the temporary pointer. Return prev as the new head.',
    starter_code = '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}'
WHERE title = 'Reverse Linked List';

-- 3. Longest Substring Without Repeating Characters (Google)
INSERT INTO coding_problems (title, description, difficulty, company_id, test_cases, starter_code, topic_tags, hints, solution_explanation, time_complexity, space_complexity) VALUES
('Longest Substring Without Repeating Characters', 
'Given a string `s`, find the length of the longest substring without repeating characters.\n\n**Example 1:**\n- Input: `s = "abcabcbb"`\n- Output: `3` (The substring is "abc")\n\n**Example 2:**\n- Input: `s = "bbbbb"`\n- Output: `1` (The substring is "b")',
'MEDIUM', @google_id,
'[{"input":"abcabcbb","output":"3"},{"input":"bbbbb","output":"1"},{"input":"pwwkew","output":"3"},{"input":"","output":"0"}]',
'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}',
'String, Sliding Window, HashMap',
'["Use a sliding window approach with a left and right pointer.","Store the last index of each character in a map to skip duplicates."]',
'Using a sliding window, we maintain a HashMap to keep track of the most recent index of each character. When we find a duplicate character inside our window, we shift the left pointer to the right of the duplicate character''s index.',
'O(N)', 'O(min(M, A)) where A is alphabet size');

-- 4. Container With Most Water (Meta)
INSERT INTO coding_problems (title, description, difficulty, company_id, test_cases, starter_code, topic_tags, hints, solution_explanation, time_complexity, space_complexity) VALUES
('Container With Most Water', 
'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
'MEDIUM', @meta_id,
'[{"input":"[1,8,6,2,5,4,8,3,7]","output":"49"},{"input":"[1,1]","output":"1"},{"input":"[4,3,2,1,4]","output":"16"}]',
'class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}',
'Arrays, Two Pointers',
'["Start with pointers at both ends of the array.","Move the pointer pointing to the shorter line inward to find a potential larger area."]',
'Using a two-pointer approach, we calculate the area between the left and right pointers. To maximize the area, we move the pointer corresponding to the smaller height inward, as a larger area can only be found by choosing a taller wall.',
'O(N)', 'O(1)');

-- 5. Merge K Sorted Lists (Amazon)
INSERT INTO coding_problems (title, description, difficulty, company_id, test_cases, starter_code, topic_tags, hints, solution_explanation, time_complexity, space_complexity) VALUES
('Merge K Sorted Lists', 
'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
'HARD', @amazon_id,
'[{"input":"[[1,4,5],[1,3,4],[2,6]]","output":"[1,1,2,3,4,4,5,6]"},{"input":"[]","output":"[]"},{"input":"[[]]","output":"[]"}]',
'/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; }\n * }\n */\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your code here\n        return null;\n    }\n}',
'Linked List, Divide and Conquer, Priority Queue',
'["Use a Min-Heap (PriorityQueue) to compare the head nodes of all lists.","Extract the minimum node, append it to the result, and insert its next node into the heap."]',
'Initialize a Min-Heap to compare the heads of all K lists. We repeatedly extract the smallest element, append it to our merged list, and push the next element of that specific list back into the Min-Heap until all nodes are merged.',
'O(N log K)', 'O(K)');

-- 6. Median of Two Sorted Arrays (Netflix)
INSERT INTO coding_problems (title, description, difficulty, company_id, test_cases, starter_code, topic_tags, hints, solution_explanation, time_complexity, space_complexity) VALUES
('Median of Two Sorted Arrays', 
'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.',
'HARD', @netflix_id,
'[{"input":"[1,3],[2]","output":"2.00000"},{"input":"[1,2],[3,4]","output":"2.50000"}]',
'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n        return 0.0;\n    }\n}',
'Arrays, Binary Search, Divide and Conquer',
'["Partition the two arrays such that left side and right side elements are balanced.","Use binary search on the smaller array to find the correct partition point."]',
'We perform a binary search on the smaller array to find a partition point such that all elements on the left side of the partition are smaller than all elements on the right. Once partitioned, we calculate the median based on the boundary elements.',
'O(log(min(M, N)))', 'O(1)');
