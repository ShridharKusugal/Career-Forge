import json

def generate():
    problems = []

    # Helper to clean up string quotes for SQL
    def escape_sql(text):
        if not text:
            return ""
        return text.replace("'", "''")

    # 100 DSA Problems Specification
    # Each entry defines: title, difficulty, company_id, description, type, method_name, test_cases
    specs = [
        # --- ARRAYS & HASHING ---
        {
            "title": "Contains Duplicate",
            "difficulty": "EASY",
            "company_id": 1,
            "desc": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
            "type": "ARRAY_TO_BOOL",
            "method_name": "containsDuplicate",
            "test_cases": [
                {"input": "4\n1 2 3 1\n", "output": "true"},
                {"input": "4\n1 2 3 4\n", "output": "false"}
            ]
        },
        {
            "title": "Valid Anagram",
            "difficulty": "EASY",
            "company_id": 2,
            "desc": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
            "type": "TWO_STRINGS_TO_BOOL",
            "method_name": "isAnagram",
            "test_cases": [
                {"input": "anagram\nnagaram\n", "output": "true"},
                {"input": "rat\ncar\n", "output": "false"}
            ]
        },
        {
            "title": "Two Sum II",
            "difficulty": "MEDIUM",
            "company_id": 3,
            "desc": "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.",
            "type": "ARRAY_AND_VAL_TO_ARRAY",
            "method_name": "twoSum",
            "test_cases": [
                {"input": "4\n2 7 11 15\n9\n", "output": "1 2"},
                {"input": "3\n2 3 4\n6\n", "output": "1 3"}
            ]
        },
        {
            "title": "Group Anagrams",
            "difficulty": "MEDIUM",
            "company_id": 6,
            "desc": "Given an array of strings, group the anagrams together. You can return the answer in any order.",
            "type": "ARRAY_OF_STRINGS_TO_INT",
            "method_name": "groupAnagrams",
            "test_cases": [
                {"input": "6\neat tea tan ate nat bat\n", "output": "3"},
                {"input": "1\na\n", "output": "1"}
            ]
        },
        {
            "title": "Top K Frequent Elements",
            "difficulty": "MEDIUM",
            "company_id": 7,
            "desc": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
            "type": "ARRAY_AND_VAL_TO_ARRAY",
            "method_name": "topKFrequent",
            "test_cases": [
                {"input": "6\n1 1 1 2 2 3\n2\n", "output": "1 2"},
                {"input": "1\n1\n1\n", "output": "1"}
            ]
        },
        {
            "title": "Product of Array Except Self",
            "difficulty": "MEDIUM",
            "company_id": 8,
            "desc": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. The algorithm must run in O(n) time.",
            "type": "ARRAY_TO_ARRAY",
            "method_name": "productExceptSelf",
            "test_cases": [
                {"input": "4\n1 2 3 4\n", "output": "24 12 8 6"},
                {"input": "5\n-1 1 0 -3 3\n", "output": "0 0 9 0 0"}
            ]
        },
        {
            "title": "Longest Consecutive Sequence",
            "difficulty": "HARD",
            "company_id": 9,
            "desc": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. The algorithm must run in O(n) time.",
            "type": "ARRAY_TO_INT",
            "method_name": "longestConsecutive",
            "test_cases": [
                {"input": "6\n100 4 200 1 3 2\n", "output": "4"},
                {"input": "10\n0 3 7 2 5 8 4 6 0 1\n", "output": "9"}
            ]
        },
        {
            "title": "Find Pivot Index",
            "difficulty": "EASY",
            "company_id": 10,
            "desc": "Given an array of integers `nums`, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.",
            "type": "ARRAY_TO_INT",
            "method_name": "pivotIndex",
            "test_cases": [
                {"input": "6\n1 7 3 6 5 6\n", "output": "3"},
                {"input": "3\n1 2 3\n", "output": "-1"}
            ]
        },
        {
            "title": "Range Sum Query",
            "difficulty": "EASY",
            "company_id": 11,
            "desc": "Given an integer array `nums`, compute the sum of the elements of `nums` between indices `left` and `right` inclusive.",
            "type": "ARRAY_AND_TWO_VALS_TO_INT",
            "method_name": "rangeSum",
            "test_cases": [
                {"input": "6\n-2 0 3 -5 2 -1\n0 2\n", "output": "1"},
                {"input": "6\n-2 0 3 -5 2 -1\n2 5\n", "output": "-1"}
            ]
        },
        {
            "title": "Rotate Array",
            "difficulty": "MEDIUM",
            "company_id": 12,
            "desc": "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.",
            "type": "ARRAY_AND_VAL_TO_ARRAY",
            "method_name": "rotate",
            "test_cases": [
                {"input": "7\n1 2 3 4 5 6 7\n3\n", "output": "5 6 7 1 2 3 4"},
                {"input": "4\n-1 -100 3 99\n2\n", "output": "3 99 -1 -100"}
            ]
        },
        {
            "title": "Contains Duplicate II",
            "difficulty": "EASY",
            "company_id": 13,
            "desc": "Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` in the array such that `nums[i] == nums[j]` and `abs(i - j) <= k`.",
            "type": "ARRAY_AND_VAL_TO_BOOL",
            "method_name": "containsNearbyDuplicate",
            "test_cases": [
                {"input": "4\n1 2 3 1\n3\n", "output": "true"},
                {"input": "4\n1 2 3 1\n2\n", "output": "false"}
            ]
        },
        {
            "title": "Subarray Sum Equals K",
            "difficulty": "MEDIUM",
            "company_id": 14,
            "desc": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "subarraySum",
            "test_cases": [
                {"input": "3\n1 1 1\n2\n", "output": "2"},
                {"input": "3\n1 2 3\n3\n", "output": "2"}
            ]
        },
        {
            "title": "Max Chunks To Make Sorted",
            "difficulty": "HARD",
            "company_id": 15,
            "desc": "You are given an integer array `nums` of length `n` that represents a permutation of the integers in the range `[0, n - 1]`. We split the array into some number of chunks (i.e., partitions), and individually sort each chunk. After concatenating them, the result should equal the sorted array. Return the maximum number of chunks we can make.",
            "type": "ARRAY_TO_INT",
            "method_name": "maxChunksToSorted",
            "test_cases": [
                {"input": "5\n4 3 2 1 0\n", "output": "1"},
                {"input": "5\n1 0 2 3 4\n", "output": "4"}
            ]
        },

        # --- TWO POINTERS ---
        {
            "title": "Valid Palindrome",
            "difficulty": "EASY",
            "company_id": 16,
            "desc": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
            "type": "STRING_TO_BOOL",
            "method_name": "isPalindrome",
            "test_cases": [
                {"input": "A man, a plan, a canal: Panama\n", "output": "true"},
                {"input": "race a car\n", "output": "false"}
            ]
        },
        {
            "title": "3Sum",
            "difficulty": "MEDIUM",
            "company_id": 17,
            "desc": "Given an integer array nums, return the number of unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
            "type": "ARRAY_TO_INT",
            "method_name": "threeSumCount",
            "test_cases": [
                {"input": "6\n-1 0 1 2 -1 -4\n", "output": "2"},
                {"input": "3\n0 1 1\n", "output": "0"}
            ]
        },
        {
            "title": "Container With Most Water",
            "difficulty": "MEDIUM",
            "company_id": 18,
            "desc": "You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
            "type": "ARRAY_TO_INT",
            "method_name": "maxArea",
            "test_cases": [
                {"input": "9\n1 8 6 2 5 4 8 3 7\n", "output": "49"},
                {"input": "2\n1 1\n", "output": "1"}
            ]
        },
        {
            "title": "Trapping Rain Water",
            "difficulty": "HARD",
            "company_id": 19,
            "desc": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            "type": "ARRAY_TO_INT",
            "method_name": "trap",
            "test_cases": [
                {"input": "12\n0 1 0 2 1 0 1 3 2 1 2 1\n", "output": "6"},
                {"input": "6\n4 2 0 3 2 5\n", "output": "9"}
            ]
        },
        {
            "title": "Remove Duplicates from Sorted Array",
            "difficulty": "EASY",
            "company_id": 20,
            "desc": "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in `nums`.",
            "type": "ARRAY_TO_INT",
            "method_name": "removeDuplicates",
            "test_cases": [
                {"input": "3\n1 1 2\n", "output": "2"},
                {"input": "10\n0 0 1 1 1 2 2 3 3 4\n", "output": "5"}
            ]
        },
        {
            "title": "Merge Sorted Array",
            "difficulty": "EASY",
            "company_id": 21,
            "desc": "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively. Merge `nums2` into `nums1` as one sorted array.",
            "type": "TWO_ARRAYS_TO_ARRAY",
            "method_name": "merge",
            "test_cases": [
                {"input": "3 3\n1 2 3\n2 5 6\n", "output": "1 2 2 3 5 6"},
                {"input": "1 0\n1\n\n", "output": "1"}
            ]
        },
        {
            "title": "Move Zeroes",
            "difficulty": "EASY",
            "company_id": 22,
            "desc": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place.",
            "type": "ARRAY_TO_ARRAY",
            "method_name": "moveZeroes",
            "test_cases": [
                {"input": "5\n0 1 0 3 12\n", "output": "1 3 12 0 0"},
                {"input": "1\n0\n", "output": "0"}
            ]
        },
        {
            "title": "Reverse String",
            "difficulty": "EASY",
            "company_id": 23,
            "desc": "Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.",
            "type": "STRING_TO_STRING",
            "method_name": "reverseString",
            "test_cases": [
                {"input": "hello\n", "output": "olleh"},
                {"input": "Hannah\n", "output": "hannaH"}
            ]
        },
        {
            "title": "Is Subsequence",
            "difficulty": "EASY",
            "company_id": 24,
            "desc": "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise.",
            "type": "TWO_STRINGS_TO_BOOL",
            "method_name": "isSubsequence",
            "test_cases": [
                {"input": "abc\nahbgdc\n", "output": "true"},
                {"input": "axc\nahbgdc\n", "output": "false"}
            ]
        },
        {
            "title": "Backspace String Compare",
            "difficulty": "EASY",
            "company_id": 25,
            "desc": "Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. `#` means a backspace character.",
            "type": "TWO_STRINGS_TO_BOOL",
            "method_name": "backspaceCompare",
            "test_cases": [
                {"input": "ab#c\nad#c\n", "output": "true"},
                {"input": "a#c\nb\n", "output": "false"}
            ]
        },

        # --- SLIDING WINDOW ---
        {
            "title": "Best Time to Buy and Sell Stock",
            "difficulty": "EASY",
            "company_id": 26,
            "desc": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit.",
            "type": "ARRAY_TO_INT",
            "method_name": "maxProfit",
            "test_cases": [
                {"input": "6\n7 1 5 3 6 4\n", "output": "5"},
                {"input": "5\n7 6 4 3 1\n", "output": "0"}
            ]
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "difficulty": "MEDIUM",
            "company_id": 27,
            "desc": "Given a string `s`, find the length of the longest substring without repeating characters.",
            "type": "STRING_TO_INT",
            "method_name": "lengthOfLongestSubstring",
            "test_cases": [
                {"input": "abcabcbb\n", "output": "3"},
                {"input": "pwwkew\n", "output": "3"}
            ]
        },
        {
            "title": "Longest Repeating Character Replacement",
            "difficulty": "MEDIUM",
            "company_id": 28,
            "desc": "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times. Return the length of the longest substring containing the same letter you can get after performing the above operations.",
            "type": "STRING_AND_VAL_TO_INT",
            "method_name": "characterReplacement",
            "test_cases": [
                {"input": "ABAB\n2\n", "output": "4"},
                {"input": "AABABBA\n1\n", "output": "4"}
            ]
        },
        {
            "title": "Minimum Window Substring",
            "difficulty": "HARD",
            "company_id": 29,
            "desc": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string.",
            "type": "TWO_STRINGS_TO_STRING",
            "method_name": "minWindow",
            "test_cases": [
                {"input": "ADOBECODEBANC\nABC\n", "output": "BANC"},
                {"input": "a\na\n", "output": "a"}
            ]
        },
        {
            "title": "Permutation in String",
            "difficulty": "MEDIUM",
            "company_id": 30,
            "desc": "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.",
            "type": "TWO_STRINGS_TO_BOOL",
            "method_name": "checkInclusion",
            "test_cases": [
                {"input": "ab\neidbaooo\n", "output": "true"},
                {"input": "ab\neidboaoo\n", "output": "false"}
            ]
        },
        {
            "title": "Minimum Size Subarray Sum",
            "difficulty": "MEDIUM",
            "company_id": 31,
            "desc": "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray of which the sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "minSubArrayLen",
            "test_cases": [
                {"input": "6\n2 3 1 2 4 3\n7\n", "output": "2"},
                {"input": "8\n1 1 1 1 1 1 1 1\n11\n", "output": "0"}
            ]
        },
        {
            "title": "Max Consecutive Ones III",
            "difficulty": "MEDIUM",
            "company_id": 32,
            "desc": "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`'s in the array if you can flip at most `k` `0`'s.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "longestOnes",
            "test_cases": [
                {"input": "11\n1 1 1 0 0 0 1 1 1 1 0\n2\n", "output": "6"},
                {"input": "19\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\n3\n", "output": "10"}
            ]
        },
        {
            "title": "Find All Anagrams in a String",
            "difficulty": "MEDIUM",
            "company_id": 33,
            "desc": "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`. You may return the answer in any order.",
            "type": "TWO_STRINGS_TO_ARRAY",
            "method_name": "findAnagrams",
            "test_cases": [
                {"input": "cbaebabacd\nabc\n", "output": "0 6"},
                {"input": "abab\nab\n", "output": "0 1 2"}
            ]
        },
        {
            "title": "Subarrays with K Different Integers",
            "difficulty": "HARD",
            "company_id": 34,
            "desc": "Given an integer array `nums` and an integer `k`, return the number of good subarrays of `nums`. A good subarray is an array where the number of different integers in that subarray is exactly `k`.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "subarraysWithKDistinct",
            "test_cases": [
                {"input": "5\n1 2 1 2 3\n2\n", "output": "7"},
                {"input": "5\n1 2 1 3 4\n3\n", "output": "3"}
            ]
        },
        {
            "title": "Subarray Product Less Than K",
            "difficulty": "MEDIUM",
            "company_id": 35,
            "desc": "Given an array of integers `nums` and an integer `k`, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than `k`.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "numSubarrayProductLessThanK",
            "test_cases": [
                {"input": "4\n10 5 2 6\n100\n", "output": "8"},
                {"input": "3\n1 2 3\n0\n", "output": "0"}
            ]
        },

        # --- STACK & QUEUE ---
        {
            "title": "Valid Parentheses",
            "difficulty": "EASY",
            "company_id": 4,
            "desc": "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.",
            "type": "STRING_TO_BOOL",
            "method_name": "isValid",
            "test_cases": [
                {"input": "()\n", "output": "true"},
                {"input": "()[]{}\n", "output": "true"},
                {"input": "(]\n", "output": "false"}
            ]
        },
        {
            "title": "Min Stack",
            "difficulty": "MEDIUM",
            "company_id": 5,
            "desc": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack operations based on stdin commands: `push X`, `pop`, `top`, `getMin`.",
            "type": "STACK_OPERATIONS",
            "method_name": "minStackOps",
            "test_cases": [
                {"input": "5\npush -2\npush 0\npush -3\ngetMin\npop\n", "output": "-3"},
                {"input": "6\npush 5\npush 3\ngetMin\npush 2\ngetMin\ntop\n", "output": "3\n2\n2"}
            ]
        },
        {
            "title": "Evaluate Reverse Polish Notation",
            "difficulty": "MEDIUM",
            "company_id": 6,
            "desc": "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, and `/`.",
            "type": "ARRAY_OF_STRINGS_TO_INT",
            "method_name": "evalRPN",
            "test_cases": [
                {"input": "5\n2 1 + 3 *\n", "output": "9"},
                {"input": "5\n4 13 5 / +\n", "output": "6"}
            ]
        },
        {
            "title": "Generate Parentheses",
            "difficulty": "MEDIUM",
            "company_id": 7,
            "desc": "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
            "type": "INT_TO_LIST_OF_STRINGS",
            "method_name": "generateParenthesis",
            "test_cases": [
                {"input": "3\n", "output": "((())) (()()) (())() ()(()) ()()()"},
                {"input": "1\n", "output": "()"}
            ]
        },
        {
            "title": "Daily Temperatures",
            "difficulty": "MEDIUM",
            "company_id": 8,
            "desc": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature.",
            "type": "ARRAY_TO_ARRAY",
            "method_name": "dailyTemperatures",
            "test_cases": [
                {"input": "8\n73 74 75 71 69 72 76 73\n", "output": "1 1 4 2 1 1 0 0"},
                {"input": "4\n30 40 50 60\n", "output": "1 1 1 0"}
            ]
        },
        {
            "title": "Car Fleet",
            "difficulty": "MEDIUM",
            "company_id": 9,
            "desc": "There are `n` cars at given miles away from the starting milestone `target`. Return the number of car fleets that will arrive at the destination.",
            "type": "CAR_FLEET",
            "method_name": "carFleet",
            "test_cases": [
                {"input": "12\n5\n10 8 0 5 3\n2 4 1 1 3\n", "output": "3"},
                {"input": "10\n1\n3\n3\n", "output": "1"}
            ]
        },
        {
            "title": "Largest Rectangle in Histogram",
            "difficulty": "HARD",
            "company_id": 10,
            "desc": "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
            "type": "ARRAY_TO_INT",
            "method_name": "largestRectangleArea",
            "test_cases": [
                {"input": "6\n2 1 5 6 2 3\n", "output": "10"},
                {"input": "2\n2 4\n", "output": "4"}
            ]
        },
        {
            "title": "Implement Queue using Stacks",
            "difficulty": "EASY",
            "company_id": 11,
            "desc": "Implement a first-in first-out (FIFO) queue using only two stacks. The operations are: `push X`, `pop`, `peek`, `empty`.",
            "type": "QUEUE_OPERATIONS",
            "method_name": "queueOps",
            "test_cases": [
                {"input": "5\npush 1\npush 2\npeek\npop\nempty\n", "output": "1\nfalse"}
            ]
        },
        {
            "title": "Implement Stack using Queues",
            "difficulty": "EASY",
            "company_id": 12,
            "desc": "Implement a last-in first-out (LIFO) stack using only queues. The operations are: `push X`, `pop`, `top`, `empty`.",
            "type": "STACK_OPERATIONS",
            "method_name": "stackOps",
            "test_cases": [
                {"input": "5\npush 1\npush 2\ntop\npop\nempty\n", "output": "2\nfalse"}
            ]
        },
        {
            "title": "Next Greater Element",
            "difficulty": "EASY",
            "company_id": 13,
            "desc": "The next greater element of some element `x` in an array is the first greater element that is to the right of `x` in the same array. Find the next greater elements.",
            "type": "ARRAY_TO_ARRAY",
            "method_name": "nextGreaterElement",
            "test_cases": [
                {"input": "4\n1 3 4 2\n", "output": "3 4 -1 -1"},
                {"input": "3\n6 5 4\n", "output": "-1 -1 -1"}
            ]
        },

        # --- BINARY SEARCH ---
        {
            "title": "Binary Search",
            "difficulty": "EASY",
            "company_id": 14,
            "desc": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "search",
            "test_cases": [
                {"input": "6\n-1 0 3 5 9 12\n9\n", "output": "4"},
                {"input": "6\n-1 0 3 5 9 12\n2\n", "output": "-1"}
            ]
        },
        {
            "title": "Search a 2D Matrix",
            "difficulty": "MEDIUM",
            "company_id": 15,
            "desc": "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix`.",
            "type": "MATRIX_SEARCH",
            "method_name": "searchMatrix",
            "test_cases": [
                {"input": "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3\n", "output": "true"},
                {"input": "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13\n", "output": "false"}
            ]
        },
        {
            "title": "Koko Eating Bananas",
            "difficulty": "MEDIUM",
            "company_id": 16,
            "desc": "Koko loves to eat bananas. There are `n` piles of bananas. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "minEatingSpeed",
            "test_cases": [
                {"input": "4\n3 6 7 11\n8\n", "output": "4"},
                {"input": "5\n30 11 23 4 20\n5\n", "output": "30"}
            ]
        },
        {
            "title": "Search in Rotated Sorted Array",
            "difficulty": "MEDIUM",
            "company_id": 17,
            "desc": "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "searchRotated",
            "test_cases": [
                {"input": "7\n4 5 6 7 0 1 2\n0\n", "output": "4"},
                {"input": "7\n4 5 6 7 0 1 2\n3\n", "output": "-1"}
            ]
        },
        {
            "title": "Find Minimum in Rotated Sorted Array",
            "difficulty": "MEDIUM",
            "company_id": 18,
            "desc": "Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.",
            "type": "ARRAY_TO_INT",
            "method_name": "findMin",
            "test_cases": [
                {"input": "5\n3 4 5 1 2\n", "output": "1"},
                {"input": "7\n4 5 6 7 0 1 2\n", "output": "0"}
            ]
        },
        {
            "title": "Time Based Key-Value Store",
            "difficulty": "MEDIUM",
            "company_id": 19,
            "desc": "Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp. Commands: `set key val ts`, `get key ts`.",
            "type": "TIME_STORE",
            "method_name": "timeStoreOps",
            "test_cases": [
                {"input": "4\nset foo bar 1\nget foo 1\nget foo 3\nset foo bar2 4\n", "output": "bar\nbar"}
            ]
        },
        {
            "title": "Median of Two Sorted Arrays",
            "difficulty": "HARD",
            "company_id": 20,
            "desc": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.",
            "type": "TWO_ARRAYS_TO_DOUBLE",
            "method_name": "findMedianSortedArrays",
            "test_cases": [
                {"input": "2 1\n1 3\n2\n", "output": "2.0"},
                {"input": "2 2\n1 2\n3 4\n", "output": "2.5"}
            ]
        },
        {
            "title": "Search Insert Position",
            "difficulty": "EASY",
            "company_id": 21,
            "desc": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "searchInsert",
            "test_cases": [
                {"input": "4\n1 3 5 6\n5\n", "output": "2"},
                {"input": "4\n1 3 5 6\n2\n", "output": "1"}
            ]
        },
        {
            "title": "First and Last Position of Element",
            "difficulty": "MEDIUM",
            "company_id": 22,
            "desc": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.",
            "type": "ARRAY_AND_VAL_TO_ARRAY",
            "method_name": "searchRange",
            "test_cases": [
                {"input": "6\n5 7 7 8 8 10\n8\n", "output": "3 4"},
                {"input": "6\n5 7 7 8 8 10\n6\n", "output": "-1 -1"}
            ]
        },
        {
            "title": "Peak Index in a Mountain Array",
            "difficulty": "EASY",
            "company_id": 23,
            "desc": "Given a mountain array `arr`, return the index `i` such that `arr[0] < arr[1] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1]`.",
            "type": "ARRAY_TO_INT",
            "method_name": "peakIndexInMountainArray",
            "test_cases": [
                {"input": "3\n0 1 0\n", "output": "1"},
                {"input": "4\n0 2 1 0\n", "output": "1"},
                {"input": "4\n0 10 5 2\n", "output": "1"}
            ]
        },

        # --- LINKED LIST ---
        {
            "title": "Merge Two Sorted Lists",
            "difficulty": "EASY",
            "company_id": 24,
            "desc": "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
            "type": "LIST_AND_LIST_TO_LIST",
            "method_name": "mergeTwoLists",
            "test_cases": [
                {"input": "3\n1 2 4\n3\n1 3 4\n", "output": "1 1 2 3 4 4"},
                {"input": "0\n\n0\n\n", "output": ""}
            ]
        },
        {
            "title": "Reorder List",
            "difficulty": "MEDIUM",
            "company_id": 25,
            "desc": "You are given the head of a singly linked list. Reorder the list to be on the following form: `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...`",
            "type": "LIST_TO_LIST",
            "method_name": "reorderList",
            "test_cases": [
                {"input": "4\n1 2 3 4\n", "output": "1 4 2 3"},
                {"input": "5\n1 2 3 4 5\n", "output": "1 5 2 4 3"}
            ]
        },
        {
            "title": "Remove Nth Node From End",
            "difficulty": "MEDIUM",
            "company_id": 26,
            "desc": "Given the head of a linked list, remove the `n`th node from the end of the list and return its head.",
            "type": "LIST_AND_VAL_TO_LIST",
            "method_name": "removeNthFromEnd",
            "test_cases": [
                {"input": "5\n1 2 3 4 5\n2\n", "output": "1 2 3 5"},
                {"input": "1\n1\n1\n", "output": ""}
            ]
        },
        {
            "title": "Copy List with Random Pointer",
            "difficulty": "MEDIUM",
            "company_id": 27,
            "desc": "A linked list of length `n` is given such that each node contains an additional random pointer, which could point to any node in the list, or null. Construct a deep copy of the list. Return the head of the copied linked list.",
            "type": "LIST_TO_LIST",
            "method_name": "copyRandomList",
            "test_cases": [
                {"input": "3\n1 2 3\n", "output": "1 2 3"}
            ]
        },
        {
            "title": "Add Two Numbers",
            "difficulty": "MEDIUM",
            "company_id": 28,
            "desc": "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            "type": "LIST_AND_LIST_TO_LIST",
            "method_name": "addTwoNumbers",
            "test_cases": [
                {"input": "3\n2 4 3\n3\n5 6 4\n", "output": "7 0 8"},
                {"input": "1\n0\n1\n0\n", "output": "0"}
            ]
        },
        {
            "title": "Linked List Cycle",
            "difficulty": "EASY",
            "company_id": 29,
            "desc": "Given head, the head of a linked list, determine if the linked list has a cycle in it. Output `true` or `false`.",
            "type": "LIST_TO_BOOL",
            "method_name": "hasCycle",
            "test_cases": [
                {"input": "4\n3 2 0 -4\n1\n", "output": "true"},
                {"input": "2\n1 2\n-1\n", "output": "false"}
            ]
        },
        {
            "title": "Find the Duplicate Number",
            "difficulty": "MEDIUM",
            "company_id": 30,
            "desc": "Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive. There is only one repeated number in `nums`, return this repeated number.",
            "type": "ARRAY_TO_INT",
            "method_name": "findDuplicate",
            "test_cases": [
                {"input": "5\n1 3 4 2 2\n", "output": "2"},
                {"input": "5\n3 1 3 4 2\n", "output": "3"}
            ]
        },
        {
            "title": "LRU Cache",
            "difficulty": "MEDIUM",
            "company_id": 31,
            "desc": "Design a data structure that follows the constraints of a Least Recently Used (LRU) Cache. Implement the LRU Cache commands: `put key val`, `get key`.",
            "type": "LRU_CACHE",
            "method_name": "lruCacheOps",
            "test_cases": [
                {"input": "2\n6\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 1\n", "output": "1\n-1\n1"}
            ]
        },
        {
            "title": "Merge k Sorted Lists",
            "difficulty": "HARD",
            "company_id": 32,
            "desc": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
            "type": "LIST_OF_LISTS_TO_LIST",
            "method_name": "mergeKLists",
            "test_cases": [
                {"input": "3\n3\n1 4 5\n3\n1 3 4\n2\n2 6\n", "output": "1 1 2 3 4 4 5 6"}
            ]
        },
        {
            "title": "Rotate List",
            "difficulty": "MEDIUM",
            "company_id": 33,
            "desc": "Given the head of a linked list, rotate the list to the right by `k` places.",
            "type": "LIST_AND_VAL_TO_LIST",
            "method_name": "rotateRight",
            "test_cases": [
                {"input": "5\n1 2 3 4 5\n2\n", "output": "4 5 1 2 3"}
            ]
        },

        # --- TREES & GRAPHS ---
        {
            "title": "Invert Binary Tree",
            "difficulty": "EASY",
            "company_id": 34,
            "desc": "Given the `root` of a binary tree, invert the tree, and return its root.",
            "type": "TREE_TO_TREE",
            "method_name": "invertTree",
            "test_cases": [
                {"input": "7\n4 2 7 1 3 6 9\n", "output": "4 7 2 9 6 3 1"},
                {"input": "3\n2 1 3\n", "output": "2 3 1"}
            ]
        },
        {
            "title": "Maximum Depth of Binary Tree",
            "difficulty": "EASY",
            "company_id": 35,
            "desc": "Given the `root` of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
            "type": "TREE_TO_INT",
            "method_name": "maxDepth",
            "test_cases": [
                {"input": "7\n3 9 20 -1 -1 15 7\n", "output": "3"},
                {"input": "2\n1 -1 2\n", "output": "2"}
            ]
        },
        {
            "title": "Diameter of Binary Tree",
            "difficulty": "EASY",
            "company_id": 1,
            "desc": "Given the `root` of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
            "type": "TREE_TO_INT",
            "method_name": "diameterOfBinaryTree",
            "test_cases": [
                {"input": "5\n1 2 3 4 5\n", "output": "3"},
                {"input": "2\n1 2\n", "output": "1"}
            ]
        },
        {
            "title": "Balanced Binary Tree",
            "difficulty": "EASY",
            "company_id": 2,
            "desc": "Given a binary tree, determine if it is height-balanced.",
            "type": "TREE_TO_BOOL",
            "method_name": "isBalanced",
            "test_cases": [
                {"input": "7\n3 9 20 -1 -1 15 7\n", "output": "true"},
                {"input": "6\n1 2 2 3 3 -1 -1\n", "output": "false"}
            ]
        },
        {
            "title": "Same Tree",
            "difficulty": "EASY",
            "company_id": 3,
            "desc": "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.",
            "type": "TWO_TREES_TO_BOOL",
            "method_name": "isSameTree",
            "test_cases": [
                {"input": "3\n1 2 3\n3\n1 2 3\n", "output": "true"},
                {"input": "2\n1 2\n2\n1 -1 2\n", "output": "false"}
            ]
        },
        {
            "title": "Subtree of Another Tree",
            "difficulty": "EASY",
            "company_id": 4,
            "desc": "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise.",
            "type": "TWO_TREES_TO_BOOL",
            "method_name": "isSubtree",
            "test_cases": [
                {"input": "5\n3 4 5 1 2\n3\n4 1 2\n", "output": "true"},
                {"input": "5\n3 4 5 1 2\n3\n4 1 -1\n", "output": "false"}
            ]
        },
        {
            "title": "Lowest Common Ancestor",
            "difficulty": "EASY",
            "company_id": 5,
            "desc": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
            "type": "TREE_LCA",
            "method_name": "lowestCommonAncestor",
            "test_cases": [
                {"input": "6\n6 2 8 0 4 7 9\n2 8\n", "output": "6"},
                {"input": "6\n6 2 8 0 4 7 9\n2 4\n", "output": "2"}
            ]
        },
        {
            "title": "Binary Tree Level Order Traversal",
            "difficulty": "MEDIUM",
            "company_id": 6,
            "desc": "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level). Print the traversal as space-separated lists.",
            "type": "TREE_TO_LEVEL_ORDER",
            "method_name": "levelOrder",
            "test_cases": [
                {"input": "7\n3 9 20 -1 -1 15 7\n", "output": "3\n9 20\n15 7"}
            ]
        },
        {
            "title": "Validate Binary Search Tree",
            "difficulty": "MEDIUM",
            "company_id": 7,
            "desc": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
            "type": "TREE_TO_BOOL",
            "method_name": "isValidBST",
            "test_cases": [
                {"input": "3\n2 1 3\n", "output": "true"},
                {"input": "5\n5 1 4 -1 -1 3 6\n", "output": "false"}
            ]
        },
        {
            "title": "Kth Smallest Element in a BST",
            "difficulty": "MEDIUM",
            "company_id": 8,
            "desc": "Given the root of a binary search tree, and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.",
            "type": "TREE_AND_VAL_TO_INT",
            "method_name": "kthSmallest",
            "test_cases": [
                {"input": "4\n3 1 4 -1 2\n1\n", "output": "1"},
                {"input": "6\n5 3 6 2 4 -1 1\n3\n", "output": "3"}
            ]
        },

        # --- HEAP & PRIORITY QUEUE ---
        {
            "title": "Kth Largest Element in a Stream",
            "difficulty": "EASY",
            "company_id": 9,
            "desc": "Design a class to find the `k`th largest element in a stream. Commands: `add X`.",
            "type": "KTH_LARGEST_STREAM",
            "method_name": "kthLargestOps",
            "test_cases": [
                {"input": "3\n4\n4 5 8 2\n4\nadd 3\nadd 5\nadd 10\nadd 9\n", "output": "4\n5\n5\n8"}
            ]
        },
        {
            "title": "Last Stone Weight",
            "difficulty": "EASY",
            "company_id": 10,
            "desc": "You are given an array of integers `stones` where `stones[i]` is the weight of the `i`th stone. We are playing a game with the stones. Return the weight of the last remaining stone. If there are no stones left, return `0`.",
            "type": "ARRAY_TO_INT",
            "method_name": "lastStoneWeight",
            "test_cases": [
                {"input": "6\n2 7 4 1 8 1\n", "output": "1"},
                {"input": "1\n1\n", "output": "1"}
            ]
        },
        {
            "title": "K Closest Points to Origin",
            "difficulty": "MEDIUM",
            "company_id": 11,
            "desc": "Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.",
            "type": "POINTS_AND_VAL_TO_POINTS",
            "method_name": "kClosest",
            "test_cases": [
                {"input": "2\n1 3\n-2 2\n1\n", "output": "-2 2"}
            ]
        },
        {
            "title": "Kth Largest Element in an Array",
            "difficulty": "MEDIUM",
            "company_id": 12,
            "desc": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "findKthLargest",
            "test_cases": [
                {"input": "6\n3 2 1 5 6 4\n2\n", "output": "5"},
                {"input": "9\n3 2 3 1 2 4 5 5 6\n4\n", "output": "4"}
            ]
        },
        {
            "title": "Task Scheduler",
            "difficulty": "MEDIUM",
            "company_id": 13,
            "desc": "Given a characters array `tasks`, representing the tasks a CPU needs to do, and a cooling time `n`, return the least number of units of times that the CPU will take to finish all the given tasks.",
            "type": "TASKS_AND_VAL_TO_INT",
            "method_name": "leastInterval",
            "test_cases": [
                {"input": "6\nA A A B B B\n2\n", "output": "8"},
                {"input": "6\nA A A B B B\n0\n", "output": "6"}
            ]
        },
        {
            "title": "Design Twitter",
            "difficulty": "MEDIUM",
            "company_id": 14,
            "desc": "Design a simplified version of Twitter. Commands: `postTweet userId tweetId`, `getNewsFeed userId`, `follow followerId followeeId`, `unfollow followerId followeeId`.",
            "type": "TWITTER_DESIGN",
            "method_name": "twitterOps",
            "test_cases": [
                {"input": "5\npostTweet 1 5\ngetNewsFeed 1\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1\n", "output": "5\n6 5"}
            ]
        },
        {
            "title": "Find Median from Data Stream",
            "difficulty": "HARD",
            "company_id": 15,
            "desc": "Design a data structure that supports adding numbers from a data stream and finding the median of the numbers. Commands: `addNum X`, `findMedian`.",
            "type": "MEDIAN_STREAM",
            "method_name": "medianStreamOps",
            "test_cases": [
                {"input": "4\naddNum 1\naddNum 2\nfindMedian\naddNum 3\n", "output": "1.5"}
            ]
        },
        {
            "title": "Top K Frequent Words",
            "difficulty": "MEDIUM",
            "company_id": 16,
            "desc": "Given an array of strings `words` and an integer `k`, return the `k` most frequent strings. Return the answer sorted by the frequency from highest to lowest, and alphabetically for words with same frequency.",
            "type": "WORDS_AND_VAL_TO_WORDS",
            "method_name": "topKFrequentWords",
            "test_cases": [
                {"input": "6\ni love coding i love coding\n2\n", "output": "coding i"},
                {"input": "6\nthe day is sunny the the\n4\n", "output": "the day is sunny"}
            ]
        },
        {
            "title": "Reorganize String",
            "difficulty": "MEDIUM",
            "company_id": 17,
            "desc": "Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same. Return any possible rearrangement, or return empty string if not possible. Note: Verification matches length of returned string and verifies correctness. Output length or check if possible.",
            "type": "STRING_TO_BOOL",
            "method_name": "canReorganize",
            "test_cases": [
                {"input": "aab\n", "output": "true"},
                {"input": "aaab\n", "output": "false"}
            ]
        },
        {
            "title": "Furthest Building You Can Reach",
            "difficulty": "MEDIUM",
            "company_id": 18,
            "desc": "You are given an integer array `heights` representing the heights of buildings, some `bricks`, and some `ladders`. Return the furthest building index (0-indexed) you can reach.",
            "type": "BUILDING_LADDERS_TO_INT",
            "method_name": "furthestBuilding",
            "test_cases": [
                {"input": "7\n4 2 7 6 9 14 12\n5 1\n", "output": "4"}
            ]
        },

        # --- RECURSION & BACKTRACKING ---
        {
            "title": "Subsets",
            "difficulty": "MEDIUM",
            "company_id": 19,
            "desc": "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return count of subsets.",
            "type": "ARRAY_TO_INT",
            "method_name": "subsetsCount",
            "test_cases": [
                {"input": "3\n1 2 3\n", "output": "8"},
                {"input": "1\n0\n", "output": "2"}
            ]
        },
        {
            "title": "Combination Sum",
            "difficulty": "MEDIUM",
            "company_id": 20,
            "desc": "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of candidates where the chosen numbers sum to target. Return count of unique combinations.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "combinationSumCount",
            "test_cases": [
                {"input": "4\n2 3 6 7\n7\n", "output": "2"},
                {"input": "3\n2 3 5\n8\n", "output": "3"}
            ]
        },
        {
            "title": "Permutations",
            "difficulty": "MEDIUM",
            "company_id": 21,
            "desc": "Given an array `nums` of distinct integers, return all the possible permutations. Return count of permutations.",
            "type": "ARRAY_TO_INT",
            "method_name": "permutationsCount",
            "test_cases": [
                {"input": "3\n1 2 3\n", "output": "6"},
                {"input": "2\n0 1\n", "output": "2"}
            ]
        },
        {
            "title": "Subsets II",
            "difficulty": "MEDIUM",
            "company_id": 22,
            "desc": "Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return count of subsets.",
            "type": "ARRAY_TO_INT",
            "method_name": "subsetsWithDupCount",
            "test_cases": [
                {"input": "3\n1 2 2\n", "output": "6"},
                {"input": "1\n0\n", "output": "2"}
            ]
        },
        {
            "title": "Combination Sum II",
            "difficulty": "MEDIUM",
            "company_id": 23,
            "desc": "Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`. Each number in `candidates` may only be used once in the combination. Return count of combinations.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "combinationSum2Count",
            "test_cases": [
                {"input": "7\n10 1 2 7 6 1 5\n8\n", "output": "4"}
            ]
        },
        {
            "title": "Word Search",
            "difficulty": "MEDIUM",
            "company_id": 24,
            "desc": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
            "type": "GRID_WORD_TO_BOOL",
            "method_name": "exist",
            "test_cases": [
                {"input": "3 4\nA B C E\nS F C S\nA D E E\nABCCED\n", "output": "true"},
                {"input": "3 4\nA B C E\nS F C S\nA D E E\nSEE\n", "output": "true"},
                {"input": "3 4\nA B C E\nS F C S\nA D E E\nABCB\n", "output": "false"}
            ]
        },
        {
            "title": "Palindrome Partitioning",
            "difficulty": "MEDIUM",
            "company_id": 25,
            "desc": "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return count of unique partitionings.",
            "type": "STRING_TO_INT",
            "method_name": "partitionCount",
            "test_cases": [
                {"input": "aab\n", "output": "2"},
                {"input": "a\n", "output": "1"}
            ]
        },
        {
            "title": "Letter Combinations of a Phone Number",
            "difficulty": "MEDIUM",
            "company_id": 26,
            "desc": "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Print space-separated combinations in lexicographical order.",
            "type": "STRING_TO_WORDS",
            "method_name": "letterCombinations",
            "test_cases": [
                {"input": "23\n", "output": "ad ae af bd be bf cd ce cf"},
                {"input": "\n", "output": ""}
            ]
        },
        {
            "title": "N-Queens",
            "difficulty": "HARD",
            "company_id": 27,
            "desc": "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Return the total number of distinct solutions.",
            "type": "INT_TO_INT",
            "method_name": "totalNQueens",
            "test_cases": [
                {"input": "4\n", "output": "2"},
                {"input": "1\n", "output": "1"}
            ]
        },
        {
            "title": "Sudoku Solver",
            "difficulty": "HARD",
            "company_id": 28,
            "desc": "Write a program to solve a Sudoku puzzle by filling the empty cells. Empty cells are represented by `.`. Print `true` if solvable, and solve it.",
            "type": "SUDOKU_TO_BOOL",
            "method_name": "solveSudoku",
            "test_cases": [
                {"input": "5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9\n", "output": "true"}
            ]
        },

        # --- DYNAMIC PROGRAMMING ---
        {
            "title": "Climbing Stairs",
            "difficulty": "EASY",
            "company_id": 29,
            "desc": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            "type": "INT_TO_INT",
            "method_name": "climbStairs",
            "test_cases": [
                {"input": "2\n", "output": "2"},
                {"input": "3\n", "output": "3"}
            ]
        },
        {
            "title": "Min Cost Climbing Stairs",
            "difficulty": "EASY",
            "company_id": 30,
            "desc": "You are given an integer array `cost` where `cost[i]` is the cost of `i`th step on a staircase. Once you pay the cost, you can either climb one or two steps. Return the minimum cost to reach the top of the floor.",
            "type": "ARRAY_TO_INT",
            "method_name": "minCostClimbingStairs",
            "test_cases": [
                {"input": "3\n10 15 20\n", "output": "15"},
                {"input": "10\n1 100 1 1 1 100 1 1 100 1\n", "output": "6"}
            ]
        },
        {
            "title": "House Robber",
            "difficulty": "MEDIUM",
            "company_id": 31,
            "desc": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Return the maximum amount of money you can rob tonight without alerting the police.",
            "type": "ARRAY_TO_INT",
            "method_name": "rob",
            "test_cases": [
                {"input": "4\n1 2 3 1\n", "output": "4"},
                {"input": "5\n2 7 9 3 1\n", "output": "12"}
            ]
        },
        {
            "title": "House Robber II",
            "difficulty": "MEDIUM",
            "company_id": 32,
            "desc": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. Return the maximum amount of money you can rob tonight without alerting the police.",
            "type": "ARRAY_TO_INT",
            "method_name": "rob2",
            "test_cases": [
                {"input": "3\n2 3 2\n", "output": "3"},
                {"input": "4\n1 2 3 1\n", "output": "4"}
            ]
        },
        {
            "title": "Longest Palindromic Substring",
            "difficulty": "MEDIUM",
            "company_id": 33,
            "desc": "Given a string `s`, return the longest palindromic substring in `s`.",
            "type": "STRING_TO_STRING",
            "method_name": "longestPalindrome",
            "test_cases": [
                {"input": "babad\n", "output": "bab"},
                {"input": "cbbd\n", "output": "bb"}
            ]
        },
        {
            "title": "Palindromic Substrings",
            "difficulty": "MEDIUM",
            "company_id": 34,
            "desc": "Given a string `s`, return the number of palindromic substrings in it.",
            "type": "STRING_TO_INT",
            "method_name": "countSubstrings",
            "test_cases": [
                {"input": "abc\n", "output": "3"},
                {"input": "aaa\n", "output": "6"}
            ]
        },
        {
            "title": "Decode Ways",
            "difficulty": "MEDIUM",
            "company_id": 35,
            "desc": "A message containing letters from A-Z can be encoded into numbers. Given a string `s` containing only digits, return the number of ways to decode it.",
            "type": "STRING_TO_INT",
            "method_name": "numDecodings",
            "test_cases": [
                {"input": "12\n", "output": "2"},
                {"input": "226\n", "output": "3"}
            ]
        },
        {
            "title": "Coin Change",
            "difficulty": "MEDIUM",
            "company_id": 1,
            "desc": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
            "type": "ARRAY_AND_VAL_TO_INT",
            "method_name": "coinChange",
            "test_cases": [
                {"input": "3\n1 2 5\n11\n", "output": "3"},
                {"input": "1\n2\n3\n", "output": "-1"}
            ]
        },
        {
            "title": "Maximum Subarray",
            "difficulty": "MEDIUM",
            "company_id": 2,
            "desc": "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
            "type": "ARRAY_TO_INT",
            "method_name": "maxSubArray",
            "test_cases": [
                {"input": "9\n-2 1 -3 4 -1 2 1 -5 4\n", "output": "6"},
                {"input": "1\n1\n", "output": "1"}
            ]
        },
        {
            "title": "Jump Game",
            "difficulty": "MEDIUM",
            "company_id": 3,
            "desc": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
            "type": "ARRAY_TO_BOOL",
            "method_name": "canJump",
            "test_cases": [
                {"input": "5\n2 3 1 1 4\n", "output": "true"},
                {"input": "5\n3 2 1 0 4\n", "output": "false"}
            ]
        }
    ]

    # Map problem types to templates
    # We will generate custom Java, Python, and JavaScript starter codes for each type.
    # The starter codes will implement standard parsing of input formats and call the specified method.
    def get_starter_code(p):
        t = p["type"]
        m = p["method_name"]
        title = p["title"]
        desc = p["desc"]

        java = ""
        python = ""
        js = ""

        # --- Java Code Templates ---
        if t == "ARRAY_TO_BOOL":
            java = f"""import java.util.*;

public class Solution {{
    public static boolean {m}(int[] nums) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {{
                nums[i] = sc.nextInt();
            }}
            System.out.println({m}(nums) ? "true" : "false");
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums):
    # Write your code here
    return False

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        print('true' if {m}(nums) else 'false')"""
            js = f"""const fs = require('fs');

function {m}(nums) {{
    // Write your code here
    return false;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const nums = [];
        for (let i = 1; i <= n; i++) {{
            nums.push(parseInt(input[i]));
        }}
        console.log({m}(nums) ? 'true' : 'false');
    }}
}}
main();"""

        elif t == "TWO_STRINGS_TO_BOOL":
            java = f"""import java.util.*;

public class Solution {{
    public static boolean {m}(String s, String t) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String t = sc.hasNextLine() ? sc.nextLine().trim() : "";
        System.out.println({m}(s, t) ? "true" : "false");
    }}
}}"""
            python = f"""import sys

def {m}(s, t):
    # Write your code here
    return False

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    s = lines[0].strip() if len(lines) > 0 else ""
    t = lines[1].strip() if len(lines) > 1 else ""
    print('true' if {m}(s, t) else 'false')"""
            js = f"""const fs = require('fs');

function {m}(s, t) {{
    // Write your code here
    return false;
}}

function main() {{
    const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
    const s = lines[0] ? lines[0].trim() : "";
    const t = lines[1] ? lines[1].trim() : "";
    console.log({m}(s, t) ? 'true' : 'false');
}}
main();"""

        elif t == "ARRAY_AND_VAL_TO_ARRAY":
            java = f"""import java.util.*;

public class Solution {{
    public static int[] {m}(int[] nums, int val) {{
        // Write your code here
        return new int[0];
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {{
                nums[i] = sc.nextInt();
            }}
            int val = sc.nextInt();
            int[] res = {m}(nums, val);
            for (int i = 0; i < res.length; i++) {{
                System.out.print(res[i] + (i == res.length - 1 ? "" : " "));
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums, val):
    # Write your code here
    return []

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        val = int(input_data[n+1])
        res = {m}(nums, val)
        print(*(res))"""
            js = f"""const fs = require('fs');

function {m}(nums, val) {{
    // Write your code here
    return [];
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const nums = [];
        for (let i = 1; i <= n; i++) {{
            nums.push(parseInt(input[i]));
        }}
        const val = parseInt(input[n+1]);
        const res = {m}(nums, val);
        console.log(res.join(' '));
    }}
}}
main();"""

        elif t == "ARRAY_OF_STRINGS_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(String[] strs) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] strs = new String[n];
            for (int i = 0; i < n; i++) {{
                strs[i] = sc.next();
            }}
            System.out.println({m}(strs));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(strs):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        strs = input_data[1:n+1]
        print({m}(strs))"""
            js = f"""const fs = require('fs');

function {m}(strs) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const strs = input.slice(1, n + 1);
        console.log({m}(strs));
    }}
}}
main();"""

        elif t == "ARRAY_TO_ARRAY":
            java = f"""import java.util.*;

public class Solution {{
    public static int[] {m}(int[] nums) {{
        // Write your code here
        return new int[0];
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {{
                nums[i] = sc.nextInt();
            }}
            int[] res = {m}(nums);
            for (int i = 0; i < res.length; i++) {{
                System.out.print(res[i] + (i == res.length - 1 ? "" : " "));
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums):
    # Write your code here
    return []

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        res = {m}(nums)
        print(*(res))"""
            js = f"""const fs = require('fs');

function {m}(nums) {{
    // Write your code here
    return [];
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const nums = [];
        for (let i = 1; i <= n; i++) {{
            nums.push(parseInt(input[i]));
        }}
        const res = {m}(nums);
        console.log(res.join(' '));
    }}
}}
main();"""

        elif t == "ARRAY_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(int[] nums) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {{
                nums[i] = sc.nextInt();
            }}
            System.out.println({m}(nums));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        print({m}(nums))"""
            js = f"""const fs = require('fs');

function {m}(nums) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const nums = [];
        for (let i = 1; i <= n; i++) {{
            nums.push(parseInt(input[i]));
        }}
        console.log({m}(nums));
    }}
}}
main();"""

        elif t == "ARRAY_AND_TWO_VALS_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(int[] nums, int val1, int val2) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {{
                nums[i] = sc.nextInt();
            }}
            int val1 = sc.nextInt();
            int val2 = sc.nextInt();
            System.out.println({m}(nums, val1, val2));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums, val1, val2):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        val1 = int(input_data[n+1])
        val2 = int(input_data[n+2])
        print({m}(nums, val1, val2))"""
            js = f"""const fs = require('fs');

function {m}(nums, val1, val2) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const nums = [];
        for (let i = 1; i <= n; i++) {{
            nums.push(parseInt(input[i]));
        }}
        const val1 = parseInt(input[n+1]);
        const val2 = parseInt(input[n+2]);
        console.log({m}(nums, val1, val2));
    }}
}}
main();"""

        elif t == "ARRAY_AND_VAL_TO_BOOL":
            java = f"""import java.util.*;

public class Solution {{
    public static boolean {m}(int[] nums, int val) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {{
                nums[i] = sc.nextInt();
            }}
            int val = sc.nextInt();
            System.out.println({m}(nums, val) ? "true" : "false");
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums, val):
    # Write your code here
    return False

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        val = int(input_data[n+1])
        print('true' if {m}(nums, val) else 'false')"""
            js = f"""const fs = require('fs');

function {m}(nums, val) {{
    // Write your code here
    return false;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const nums = [];
        for (let i = 1; i <= n; i++) {{
            nums.push(parseInt(input[i]));
        }}
        const val = parseInt(input[n+1]);
        console.log({m}(nums, val) ? 'true' : 'false');
    }}
}}
main();"""

        elif t == "ARRAY_AND_VAL_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(int[] nums, int val) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {{
                nums[i] = sc.nextInt();
            }}
            int val = sc.nextInt();
            System.out.println({m}(nums, val));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums, val):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        val = int(input_data[n+1])
        print({m}(nums, val))"""
            js = f"""const fs = require('fs');

function {m}(nums, val) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const nums = [];
        for (let i = 1; i <= n; i++) {{
            nums.push(parseInt(input[i]));
        }}
        const val = parseInt(input[n+1]);
        console.log({m}(nums, val));
    }}
}}
main();"""

        elif t == "STRING_TO_BOOL":
            java = f"""import java.util.*;

public class Solution {{
    public static boolean {m}(String s) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println({m}(s) ? "true" : "false");
    }}
}}"""
            python = f"""import sys

def {m}(s):
    # Write your code here
    return False

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    print('true' if {m}(s) else 'false')"""
            js = f"""const fs = require('fs');

function {m}(s) {{
    // Write your code here
    return false;
}}

function main() {{
    const s = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    console.log({m}(s) ? 'true' : 'false');
}}
main();"""

        elif t == "TWO_ARRAYS_TO_ARRAY":
            java = f"""import java.util.*;

public class Solution {{
    public static int[] {m}(int[] nums1, int m, int[] nums2, int n) {{
        // Write your code here
        // Note: For Merge Sorted Array, Leetcode modifies nums1 in-place.
        // We will output a merged array for verification.
        int[] res = new int[m + n];
        System.arraycopy(nums1, 0, res, 0, m);
        System.arraycopy(nums2, 0, res, m, n);
        Arrays.sort(res);
        return res;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int m = sc.nextInt();
            int n = sc.nextInt();
            int[] nums1 = new int[m];
            for (int i = 0; i < m; i++) nums1[i] = sc.nextInt();
            int[] nums2 = new int[n];
            for (int i = 0; i < n; i++) nums2[i] = sc.nextInt();
            
            int[] res = {m}(nums1, m, nums2, n);
            for (int i = 0; i < res.length; i++) {{
                System.out.print(res[i] + (i == res.length - 1 ? "" : " "));
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums1, m, nums2, n):
    # Write your code here
    res = nums1[:m] + nums2[:n]
    res.sort()
    return res

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        m = int(input_data[0])
        n = int(input_data[1])
        nums1 = [int(x) for x in input_data[2:2+m]]
        nums2 = [int(x) for x in input_data[2+m:2+m+n]]
        res = {m}(nums1, m, nums2, n)
        print(*(res))"""
            js = f"""const fs = require('fs');

function {m}(nums1, m, nums2, n) {{
    // Write your code here
    const res = nums1.slice(0, m).concat(nums2.slice(0, n));
    res.sort((a, b) => a - b);
    return res;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const m = parseInt(input[0]);
        const n = parseInt(input[1]);
        const nums1 = [];
        for (let i = 0; i < m; i++) nums1.push(parseInt(input[2 + i]));
        const nums2 = [];
        for (let i = 0; i < n; i++) nums2.push(parseInt(input[2 + m + i]));
        const res = {m}(nums1, m, nums2, n);
        console.log(res.join(' '));
    }}
}}
main();"""

        elif t == "STRING_TO_STRING":
            java = f"""import java.util.*;

public class Solution {{
    public static String {m}(String s) {{
        // Write your code here
        return new StringBuilder(s).reverse().toString();
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        System.out.println({m}(s));
    }}
}}"""
            python = f"""import sys

def {m}(s):
    # Write your code here
    return s[::-1]

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    print({m}(s))"""
            js = f"""const fs = require('fs');

function {m}(s) {{
    // Write your code here
    return s.split('').reverse().join('');
}}

function main() {{
    const s = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    console.log({m}(s));
}}
main();"""

        elif t == "STRING_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(String s) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        System.out.println({m}(s));
    }}
}}"""
            python = f"""import sys

def {m}(s):
    # Write your code here
    return 0

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    print({m}(s))"""
            js = f"""const fs = require('fs');

function {m}(s) {{
    // Write your code here
    return 0;
}}

function main() {{
    const s = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    console.log({m}(s));
}}
main();"""

        elif t == "STRING_AND_VAL_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(String s, int k) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        int k = sc.hasNextInt() ? sc.nextInt() : 0;
        System.out.println({m}(s, k));
    }}
}}"""
            python = f"""import sys

def {m}(s, k):
    # Write your code here
    return 0

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    s = lines[0].strip() if len(lines) > 0 else ""
    k = int(lines[1]) if len(lines) > 1 else 0
    print({m}(s, k))"""
            js = f"""const fs = require('fs');

function {m}(s, k) {{
    // Write your code here
    return 0;
}}

function main() {{
    const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
    const s = lines[0] ? lines[0].trim() : "";
    const k = lines[1] ? parseInt(lines[1].trim()) : 0;
    console.log({m}(s, k));
}}
main();"""

        elif t == "TWO_STRINGS_TO_STRING":
            java = f"""import java.util.*;

public class Solution {{
    public static String {m}(String s, String t) {{
        // Write your code here
        return "";
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String t = sc.hasNextLine() ? sc.nextLine().trim() : "";
        System.out.println({m}(s, t));
    }}
}}"""
            python = f"""import sys

def {m}(s, t):
    # Write your code here
    return ""

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    s = lines[0].strip() if len(lines) > 0 else ""
    t = lines[1].strip() if len(lines) > 1 else ""
    print({m}(s, t))"""
            js = f"""const fs = require('fs');

function {m}(s, t) {{
    // Write your code here
    return "";
}}

function main() {{
    const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
    const s = lines[0] ? lines[0].trim() : "";
    const t = lines[1] ? lines[1].trim() : "";
    console.log({m}(s, t));
}}
main();"""

        elif t == "TWO_STRINGS_TO_ARRAY":
            java = f"""import java.util.*;

public class Solution {{
    public static List<Integer> {m}(String s, String p) {{
        // Write your code here
        return new ArrayList<>();
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String p = sc.hasNextLine() ? sc.nextLine().trim() : "";
        List<Integer> res = {m}(s, p);
        for (int i = 0; i < res.size(); i++) {{
            System.out.print(res.get(i) + (i == res.size() - 1 ? "" : " "));
        }}
        System.out.println();
    }}
}}"""
            python = f"""import sys

def {m}(s, p):
    # Write your code here
    return []

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    s = lines[0].strip() if len(lines) > 0 else ""
    p = lines[1].strip() if len(lines) > 1 else ""
    res = {m}(s, p)
    print(*(res))"""
            js = f"""const fs = require('fs');

function {m}(s, p) {{
    // Write your code here
    return [];
}}

function main() {{
    const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
    const s = lines[0] ? lines[0].trim() : "";
    const p = lines[1] ? lines[1].trim() : "";
    const res = {m}(s, p);
    console.log(res.join(' '));
}}
main();"""

        elif t == "STACK_OPERATIONS":
            java = f"""import java.util.*;

public class Solution {{
    static class MinStack {{
        Stack<Integer> s = new Stack<>();
        Stack<Integer> min = new Stack<>();

        public void push(int val) {{
            s.push(val);
            if (min.isEmpty() || val <= min.peek()) min.push(val);
        }}
        public void pop() {{
            int val = s.pop();
            if (val == min.peek()) min.pop();
        }}
        public int top() {{
            return s.peek();
        }}
        public int getMin() {{
            return min.peek();
        }}
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int ops = sc.nextInt();
            MinStack ms = new MinStack();
            for (int i = 0; i < ops; i++) {{
                String cmd = sc.next();
                if (cmd.equals("push")) {{
                    ms.push(sc.nextInt());
                }} else if (cmd.equals("pop")) {{
                    ms.pop();
                }} else if (cmd.equals("top")) {{
                    System.out.println(ms.top());
                }} else if (cmd.equals("getMin")) {{
                    System.out.println(ms.getMin());
                }}
            }}
        }}
    }}
}}"""
            python = f"""import sys

class MinStack:
    def __init__(self):
        self.s = []
        self.min = []
    def push(self, val):
        self.s.append(val)
        if not self.min or val <= self.min[-1]:
            self.min.append(val)
    def pop(self):
        val = self.s.pop()
        if val == self.min[-1]:
            self.min.pop()
    def top(self):
        return self.s[-1]
    def getMin(self):
        return self.min[-1]

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        ops = int(input_data[0])
        ms = MinStack()
        idx = 1
        for _ in range(ops):
            cmd = input_data[idx]
            idx += 1
            if cmd == 'push':
                ms.push(int(input_data[idx]))
                idx += 1
            elif cmd == 'pop':
                ms.pop()
            elif cmd == 'top':
                print(ms.top())
            elif cmd == 'getMin':
                print(ms.getMin())"""
            js = f"""const fs = require('fs');

class MinStack {{
    constructor() {{
        this.s = [];
        this.min = [];
    }}
    push(val) {{
        this.s.push(val);
        if (this.min.length === 0 || val <= this.min[this.min.length - 1]) {{
            this.min.push(val);
        }}
    }}
    pop() {{
        const val = this.s.pop();
        if (val === this.min[this.min.length - 1]) {{
            this.min.pop();
        }}
    }}
    top() {{
        return this.s[this.s.length - 1];
    }}
    getMin() {{
        return this.min[this.min.length - 1];
    }}
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const ops = parseInt(input[0]);
        const ms = new MinStack();
        let idx = 1;
        for (let i = 0; i < ops; i++) {{
            const cmd = input[idx++];
            if (cmd === 'push') {{
                ms.push(parseInt(input[idx++]));
            }} else if (cmd === 'pop') {{
                ms.pop();
            }} else if (cmd === 'top') {{
                console.log(ms.top());
            }} else if (cmd === 'getMin') {{
                console.log(ms.getMin());
            }}
        }}
    }}
}}
main();"""

        elif t == "ARRAY_OF_STRINGS_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(String[] tokens) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] tokens = new String[n];
            for (int i = 0; i < n; i++) {{
                tokens[i] = sc.next();
            }}
            System.out.println({m}(tokens));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(tokens):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        tokens = input_data[1:n+1]
        print({m}(tokens))"""
            js = f"""const fs = require('fs');

function {m}(tokens) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const tokens = input.slice(1, n + 1);
        console.log({m}(tokens));
    }}
}}
main();"""

        elif t == "INT_TO_LIST_OF_STRINGS":
            java = f"""import java.util.*;

public class Solution {{
    public static List<String> {m}(int n) {{
        // Write your code here
        return new ArrayList<>();
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            List<String> res = {m}(n);
            Collections.sort(res);
            for (int i = 0; i < res.size(); i++) {{
                System.out.print(res.get(i) + (i == res.size() - 1 ? "" : " "));
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

def {m}(n):
    # Write your code here
    return []

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        res = {m}(n)
        res.sort()
        print(*(res))"""
            js = f"""const fs = require('fs');

function {m}(n) {{
    // Write your code here
    return [];
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const res = {m}(n);
        res.sort();
        console.log(res.join(' '));
    }}
}}
main();"""

        elif t == "CAR_FLEET":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(int target, int[] position, int[] speed) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int target = sc.nextInt();
            int n = sc.nextInt();
            int[] position = new int[n];
            for (int i = 0; i < n; i++) position[i] = sc.nextInt();
            int[] speed = new int[n];
            for (int i = 0; i < n; i++) speed[i] = sc.nextInt();
            System.out.println({m}(target, position, speed));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(target, position, speed):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        target = int(input_data[0])
        n = int(input_data[1])
        position = [int(x) for x in input_data[2:2+n]]
        speed = [int(x) for x in input_data[2+n:2+2*n]]
        print({m}(target, position, speed))"""
            js = f"""const fs = require('fs');

function {m}(target, position, speed) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const target = parseInt(input[0]);
        const n = parseInt(input[1]);
        const position = [];
        for (let i = 0; i < n; i++) position.push(parseInt(input[2 + i]));
        const speed = [];
        for (let i = 0; i < n; i++) speed.push(parseInt(input[2 + n + i]));
        console.log({m}(target, position, speed));
    }}
}}
main();"""

        elif t == "QUEUE_OPERATIONS":
            java = f"""import java.util.*;

public class Solution {{
    static class MyQueue {{
        Stack<Integer> s1 = new Stack<>();
        Stack<Integer> s2 = new Stack<>();

        public void push(int x) {{
            s1.push(x);
        }}
        public int pop() {{
            peek();
            return s2.pop();
        }}
        public int peek() {{
            if (s2.isEmpty()) {{
                while (!s1.isEmpty()) s2.push(s1.pop());
            }}
            return s2.peek();
        }}
        public boolean empty() {{
            return s1.isEmpty() && s2.isEmpty();
        }}
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int ops = sc.nextInt();
            MyQueue mq = new MyQueue();
            for (int i = 0; i < ops; i++) {{
                String cmd = sc.next();
                if (cmd.equals("push")) {{
                    mq.push(sc.nextInt());
                }} else if (cmd.equals("pop")) {{
                    mq.pop();
                }} else if (cmd.equals("peek")) {{
                    System.out.println(mq.peek());
                }} else if (cmd.equals("empty")) {{
                    System.out.println(mq.empty() ? "true" : "false");
                }}
            }}
        }}
    }}
}}"""
            python = f"""import sys

class MyQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []
    def push(self, x):
        self.s1.append(x)
    def pop(self):
        self.peek()
        return self.s2.pop()
    def peek(self):
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2[-1]
    def empty(self):
        return not self.s1 and not self.s2

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        ops = int(input_data[0])
        mq = MyQueue()
        idx = 1
        for _ in range(ops):
            cmd = input_data[idx]
            idx += 1
            if cmd == 'push':
                mq.push(int(input_data[idx]))
                idx += 1
            elif cmd == 'pop':
                mq.pop()
            elif cmd == 'peek':
                print(mq.peek())
            elif cmd == 'empty':
                print('true' if mq.empty() else 'false')"""
            js = f"""const fs = require('fs');

class MyQueue {{
    constructor() {{
        this.s1 = [];
        this.s2 = [];
    }}
    push(x) {{
        this.s1.push(x);
    }}
    pop() {{
        this.peek();
        return this.s2.pop();
    }}
    peek() {{
        if (this.s2.length === 0) {{
            while (this.s1.length > 0) {{
                this.s2.push(this.s1.pop());
            }}
        }}
        return this.s2[this.s2.length - 1];
    }}
    empty() {{
        return this.s1.length === 0 && this.s2.length === 0;
    }}
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const ops = parseInt(input[0]);
        const mq = new MyQueue();
        let idx = 1;
        for (let i = 0; i < ops; i++) {{
            const cmd = input[idx++];
            if (cmd === 'push') {{
                mq.push(parseInt(input[idx++]));
            }} else if (cmd === 'pop') {{
                mq.pop();
            }} else if (cmd === 'peek') {{
                console.log(mq.peek());
            }} else if (cmd === 'empty') {{
                console.log(mq.empty() ? 'true' : 'false');
            }}
        }}
    }}
}}
main();"""

        elif t == "MATRIX_SEARCH":
            java = f"""import java.util.*;

public class Solution {{
    public static boolean {m}(int[][] matrix, int target) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int r = sc.nextInt();
            int c = sc.nextInt();
            int[][] matrix = new int[r][c];
            for (int i = 0; i < r; i++) {{
                for (int j = 0; j < c; j++) {{
                    matrix[i][j] = sc.nextInt();
                }}
            }}
            int target = sc.nextInt();
            System.out.println({m}(matrix, target) ? "true" : "false");
        }}
    }}
}}"""
            python = f"""import sys

def {m}(matrix, target):
    # Write your code here
    return False

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        r = int(input_data[0])
        c = int(input_data[1])
        matrix = []
        idx = 2
        for _ in range(r):
            row = [int(x) for x in input_data[idx:idx+c]]
            matrix.append(row)
            idx += c
        target = int(input_data[idx])
        print('true' if {m}(matrix, target) else 'false')"""
            js = f"""const fs = require('fs');

function {m}(matrix, target) {{
    // Write your code here
    return false;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const r = parseInt(input[0]);
        const c = parseInt(input[1]);
        const matrix = [];
        let idx = 2;
        for (let i = 0; i < r; i++) {{
            const row = [];
            for (let j = 0; j < c; j++) {{
                row.push(parseInt(input[idx++]));
            }}
            matrix.push(row);
        }}
        const target = parseInt(input[idx]);
        console.log({m}(matrix, target) ? 'true' : 'false');
    }}
}}
main();"""

        elif t == "TIME_STORE":
            java = f"""import java.util.*;

public class Solution {{
    static class TimeMap {{
        Map<String, List<Integer>> timestamps = new HashMap<>();
        Map<String, List<String>> values = new HashMap<>();

        public void set(String key, String value, int timestamp) {{
            timestamps.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);
            values.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
        }}
        public String get(String key, int timestamp) {{
            if (!timestamps.containsKey(key)) return "";
            List<Integer> ts = timestamps.get(key);
            int idx = Collections.binarySearch(ts, timestamp);
            if (idx >= 0) return values.get(key).get(idx);
            idx = -idx - 2;
            if (idx >= 0) return values.get(key).get(idx);
            return "";
        }}
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int ops = sc.nextInt();
            TimeMap tm = new TimeMap();
            for (int i = 0; i < ops; i++) {{
                String cmd = sc.next();
                if (cmd.equals("set")) {{
                    tm.set(sc.next(), sc.next(), sc.nextInt());
                }} else if (cmd.equals("get")) {{
                    System.out.println(tm.get(sc.next(), sc.nextInt()));
                }}
            }}
        }}
    }}
}}"""
            python = f"""import sys
import collections
import bisect

class TimeMap:
    def __init__(self):
        self.meta = collections.defaultdict(list)
    def set(self, key, value, timestamp):
        self.meta[key].append((timestamp, value))
    def get(self, key, timestamp):
        arr = self.meta[key]
        if not arr: return ""
        idx = bisect.bisect_right(arr, (timestamp, chr(127)))
        if idx == 0: return ""
        return arr[idx-1][1]

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        ops = int(input_data[0])
        tm = TimeMap()
        idx = 1
        for _ in range(ops):
            cmd = input_data[idx]
            idx += 1
            if cmd == 'set':
                tm.set(input_data[idx], input_data[idx+1], int(input_data[idx+2]))
                idx += 3
            elif cmd == 'get':
                print(tm.get(input_data[idx], int(input_data[idx+1])))
                idx += 2"""
            js = f"""const fs = require('fs');

class TimeMap {{
    constructor() {{
        this.map = new Map();
    }}
    set(key, value, timestamp) {{
        if (!this.map.has(key)) this.map.set(key, []);
        this.map.get(key).push({{ ts: timestamp, val: value }});
    }}
    get(key, timestamp) {{
        const arr = this.map.get(key);
        if (!arr) return "";
        let l = 0, r = arr.length - 1;
        let ans = "";
        while (l <= r) {{
            const mid = Math.floor((l + r) / 2);
            if (arr[mid].ts <= timestamp) {{
                ans = arr[mid].val;
                l = mid + 1;
            }} else {{
                r = mid - 1;
            }}
        }}
        return ans;
    }}
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const ops = parseInt(input[0]);
        const tm = new TimeMap();
        let idx = 1;
        for (let i = 0; i < ops; i++) {{
            const cmd = input[idx++];
            if (cmd === 'set') {{
                tm.set(input[idx], input[idx+1], parseInt(input[idx+2]));
                idx += 3;
            }} else if (cmd === 'get') {{
                console.log(tm.get(input[idx], parseInt(input[idx+1])));
                idx += 2;
            }}
        }}
    }}
}}
main();"""

        elif t == "TWO_ARRAYS_TO_DOUBLE":
            java = f"""import java.util.*;

public class Solution {{
    public static double {m}(int[] nums1, int[] nums2) {{
        // Write your code here
        return 0.0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int m = sc.nextInt();
            int n = sc.nextInt();
            int[] nums1 = new int[m];
            for (int i = 0; i < m; i++) nums1[i] = sc.nextInt();
            int[] nums2 = new int[n];
            for (int i = 0; i < n; i++) nums2[i] = sc.nextInt();
            System.out.println({m}(nums1, nums2));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(nums1, nums2):
    # Write your code here
    return 0.0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        m = int(input_data[0])
        n = int(input_data[1])
        nums1 = [int(x) for x in input_data[2:2+m]]
        nums2 = [int(x) for x in input_data[2+m:2+m+n]]
        print({m}(nums1, nums2))"""
            js = f"""const fs = require('fs');

function {m}(nums1, nums2) {{
    // Write your code here
    return 0.0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const m = parseInt(input[0]);
        const n = parseInt(input[1]);
        const nums1 = [];
        for (let i = 0; i < m; i++) nums1.push(parseInt(input[2 + i]));
        const nums2 = [];
        for (let i = 0; i < n; i++) nums2.push(parseInt(input[2 + m + i]));
        console.log({m}(nums1, nums2).toFixed(1));
    }}
}}
main();"""

        elif t == "LIST_AND_LIST_TO_LIST":
            java = f"""import java.util.*;

class ListNode {{
    int val;
    ListNode next;
    ListNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static ListNode {m}(ListNode list1, ListNode list2) {{
        // Write your code here
        return null;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int m = sc.nextInt();
            ListNode dummy1 = new ListNode(0);
            ListNode curr = dummy1;
            for (int i = 0; i < m; i++) {{
                curr.next = new ListNode(sc.nextInt());
                curr = curr.next;
            }}
            int n = sc.nextInt();
            ListNode dummy2 = new ListNode(0);
            curr = dummy2;
            for (int i = 0; i < n; i++) {{
                curr.next = new ListNode(sc.nextInt());
                curr = curr.next;
            }}
            ListNode res = {m}(dummy1.next, dummy2.next);
            while (res != null) {{
                System.out.print(res.val + (res.next == null ? "" : " "));
                res = res.next;
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def {m}(list1, list2):
    # Write your code here
    return None

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        m = int(input_data[0])
        idx = 1
        dummy1 = ListNode(0)
        curr = dummy1
        for _ in range(m):
            curr.next = ListNode(int(input_data[idx]))
            curr = curr.next
            idx += 1
        n = int(input_data[idx])
        idx += 1
        dummy2 = ListNode(0)
        curr = dummy2
        for _ in range(n):
            curr.next = ListNode(int(input_data[idx]))
            curr = curr.next
            idx += 1
        res = {m}(dummy1.next, dummy2.next)
        out = []
        while res:
            out.append(res.val)
            res = res.next
        print(*(out))"""
            js = f"""const fs = require('fs');

class ListNode {{
    constructor(val = 0, next = null) {{
        this.val = val;
        this.next = next;
    }}
}}

function {m}(list1, list2) {{
    // Write your code here
    return null;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const m = parseInt(input[0]);
        let idx = 1;
        const dummy1 = new ListNode(0);
        let curr = dummy1;
        for (let i = 0; i < m; i++) {{
            curr.next = new ListNode(parseInt(input[idx++]));
            curr = curr.next;
        }}
        const n = parseInt(input[idx++]);
        const dummy2 = new ListNode(0);
        curr = dummy2;
        for (let i = 0; i < n; i++) {{
            curr.next = new ListNode(parseInt(input[idx++]));
            curr = curr.next;
        }}
        let res = {m}(dummy1.next, dummy2.next);
        const out = [];
        while (res) {{
            out.push(res.val);
            res = res.next;
        }}
        console.log(out.join(' '));
    }}
}}
main();"""

        elif t == "LIST_TO_LIST":
            java = f"""import java.util.*;

class ListNode {{
    int val;
    ListNode next;
    ListNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static ListNode {m}(ListNode head) {{
        // Write your code here
        return null;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int m = sc.nextInt();
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            for (int i = 0; i < m; i++) {{
                curr.next = new ListNode(sc.nextInt());
                curr = curr.next;
            }}
            ListNode res = {m}(dummy.next);
            while (res != null) {{
                System.out.print(res.val + (res.next == null ? "" : " "));
                res = res.next;
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def {m}(head):
    # Write your code here
    return None

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        m = int(input_data[0])
        dummy = ListNode(0)
        curr = dummy
        for i in range(m):
            curr.next = ListNode(int(input_data[i+1]))
            curr = curr.next
        res = {m}(dummy.next)
        out = []
        while res:
            out.append(res.val)
            res = res.next
        print(*(out))"""
            js = f"""const fs = require('fs');

class ListNode {{
    constructor(val = 0, next = null) {{
        this.val = val;
        this.next = next;
    }}
}}

function {m}(head) {{
    // Write your code here
    return null;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const m = parseInt(input[0]);
        const dummy = new ListNode(0);
        let curr = dummy;
        for (let i = 0; i < m; i++) {{
            curr.next = new ListNode(parseInt(input[1 + i]));
            curr = curr.next;
        }}
        let res = {m}(dummy.next);
        const out = [];
        while (res) {{
            out.push(res.val);
            res = res.next;
        }}
        console.log(out.join(' '));
    }}
}}
main();"""

        elif t == "LIST_AND_VAL_TO_LIST":
            java = f"""import java.util.*;

class ListNode {{
    int val;
    ListNode next;
    ListNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static ListNode {m}(ListNode head, int val) {{
        // Write your code here
        return null;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int m = sc.nextInt();
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            for (int i = 0; i < m; i++) {{
                curr.next = new ListNode(sc.nextInt());
                curr = curr.next;
            }}
            int val = sc.nextInt();
            ListNode res = {m}(dummy.next, val);
            while (res != null) {{
                System.out.print(res.val + (res.next == null ? "" : " "));
                res = res.next;
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def {m}(head, val):
    # Write your code here
    return None

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        m = int(input_data[0])
        dummy = ListNode(0)
        curr = dummy
        for i in range(m):
            curr.next = ListNode(int(input_data[i+1]))
            curr = curr.next
        val = int(input_data[m+1])
        res = {m}(dummy.next, val)
        out = []
        while res:
            out.append(res.val)
            res = res.next
        print(*(out))"""
            js = f"""const fs = require('fs');

class ListNode {{
    constructor(val = 0, next = null) {{
        this.val = val;
        this.next = next;
    }}
}}

function {m}(head, val) {{
    // Write your code here
    return null;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const m = parseInt(input[0]);
        const dummy = new ListNode(0);
        let curr = dummy;
        for (let i = 0; i < m; i++) {{
            curr.next = new ListNode(parseInt(input[1 + i]));
            curr = curr.next;
        }}
        const val = parseInt(input[m+1]);
        let res = {m}(dummy.next, val);
        const out = [];
        while (res) {{
            out.push(res.val);
            res = res.next;
        }}
        console.log(out.join(' '));
    }}
}}
main();"""

        elif t == "LIST_TO_BOOL":
            java = f"""import java.util.*;

class ListNode {{
    int val;
    ListNode next;
    ListNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static boolean {m}(ListNode head) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int m = sc.nextInt();
            ListNode[] nodes = new ListNode[m];
            for (int i = 0; i < m; i++) nodes[i] = new ListNode(sc.nextInt());
            for (int i = 0; i < m - 1; i++) nodes[i].next = nodes[i+1];
            int pos = sc.nextInt();
            if (pos >= 0 && pos < m) {{
                nodes[m-1].next = nodes[pos];
            }}
            System.out.println({m}(nodes[0]) ? "true" : "false");
        }}
    }}
}}"""
            python = f"""import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def {m}(head):
    # Write your code here
    return False

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        m = int(input_data[0])
        nodes = [ListNode(int(x)) for x in input_data[1:m+1]]
        for i in range(m-1):
            nodes[i].next = nodes[i+1]
        pos = int(input_data[m+1])
        if 0 <= pos < m:
            nodes[m-1].next = nodes[pos]
        print('true' if {m}(nodes[0]) else 'false')"""
            js = f"""const fs = require('fs');

class ListNode {{
    constructor(val = 0, next = null) {{
        this.val = val;
        this.next = next;
    }}
}}

function {m}(head) {{
    // Write your code here
    return false;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const m = parseInt(input[0]);
        const nodes = [];
        for (let i = 0; i < m; i++) nodes.push(new ListNode(parseInt(input[1 + i])));
        for (let i = 0; i < m - 1; i++) nodes[i].next = nodes[i+1];
        const pos = parseInt(input[m+1]);
        if (pos >= 0 && pos < m) {{
            nodes[m-1].next = nodes[pos];
        }}
        console.log({m}(nodes[0]) ? 'true' : 'false');
    }}
}}
main();"""

        elif t == "LRU_CACHE":
            java = f"""import java.util.*;

public class Solution {{
    static class LRUCache {{
        int capacity;
        Map<Integer, Integer> map = new LinkedHashMap<>();

        public LRUCache(int capacity) {{
            this.capacity = capacity;
        }}
        public int get(int key) {{
            if (!map.containsKey(key)) return -1;
            int val = map.remove(key);
            map.put(key, val);
            return val;
        }}
        public void put(int key, int value) {{
            if (map.containsKey(key)) {{
                map.remove(key);
            }} else if (map.size() == capacity) {{
                int firstKey = map.keySet().iterator().next();
                map.remove(firstKey);
            }}
            map.put(key, value);
        }}
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int capacity = sc.nextInt();
            int ops = sc.nextInt();
            LRUCache cache = new LRUCache(capacity);
            for (int i = 0; i < ops; i++) {{
                String cmd = sc.next();
                if (cmd.equals("put")) {{
                    cache.put(sc.nextInt(), sc.nextInt());
                }} else if (cmd.equals("get")) {{
                    System.out.println(cache.get(sc.nextInt()));
                }}
            }}
        }}
    }}
}}"""
            python = f"""import sys

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.map = {{}}
    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        val = self.map.pop(key)
        self.map[key] = val
        return val
    def put(self, key: int, value: int) -> None:
        if key in self.map:
            self.map.pop(key)
        elif len(self.map) == self.capacity:
            first_key = next(iter(self.map))
            self.map.pop(first_key)
        self.map[key] = value

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        cap = int(input_data[0])
        ops = int(input_data[1])
        cache = LRUCache(cap)
        idx = 2
        for _ in range(ops):
            cmd = input_data[idx]
            idx += 1
            if cmd == 'put':
                cache.put(int(input_data[idx]), int(input_data[idx+1]))
                idx += 2
            elif cmd == 'get':
                print(cache.get(int(input_data[idx])))
                idx += 1"""
            js = f"""const fs = require('fs');

class LRUCache {{
    constructor(capacity) {{
        this.capacity = capacity;
        this.map = new Map();
    }}
    get(key) {{
        if (!this.map.has(key)) return -1;
        const val = this.map.get(key);
        this.map.delete(key);
        this.map.set(key, val);
        return val;
    }}
    put(key, value) {{
        if (this.map.has(key)) {{
            this.map.delete(key);
        }} else if (this.map.size === this.capacity) {{
            const firstKey = this.map.keys().next().value;
            this.map.delete(firstKey);
        }}
        this.map.set(key, value);
    }}
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const cap = parseInt(input[0]);
        const ops = parseInt(input[1]);
        const cache = new LRUCache(cap);
        let idx = 2;
        for (let i = 0; i < ops; i++) {{
            const cmd = input[idx++];
            if (cmd === 'put') {{
                cache.put(parseInt(input[idx++]), parseInt(input[idx++]));
            }} else if (cmd === 'get') {{
                console.log(cache.get(parseInt(input[idx++])));
            }}
        }}
    }}
}}
main();"""

        elif t == "LIST_OF_LISTS_TO_LIST":
            java = f"""import java.util.*;

class ListNode {{
    int val;
    ListNode next;
    ListNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static ListNode {m}(ListNode[] lists) {{
        // Write your code here
        return null;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int k = sc.nextInt();
            ListNode[] lists = new ListNode[k];
            for (int i = 0; i < k; i++) {{
                int m = sc.nextInt();
                ListNode dummy = new ListNode(0);
                ListNode curr = dummy;
                for (int j = 0; j < m; j++) {{
                    curr.next = new ListNode(sc.nextInt());
                    curr = curr.next;
                }}
                lists[i] = dummy.next;
            }}
            ListNode res = {m}(lists);
            while (res != null) {{
                System.out.print(res.val + (res.next == null ? "" : " "));
                res = res.next;
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def {m}(lists):
    # Write your code here
    return None

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        k = int(input_data[0])
        lists = []
        idx = 1
        for _ in range(k):
            m = int(input_data[idx])
            idx += 1
            dummy = ListNode(0)
            curr = dummy
            for _ in range(m):
                curr.next = ListNode(int(input_data[idx]))
                curr = curr.next
                idx += 1
            lists.append(dummy.next)
        res = {m}(lists)
        out = []
        while res:
            out.append(res.val)
            res = res.next
        print(*(out))"""
            js = f"""const fs = require('fs');

class ListNode {{
    constructor(val = 0, next = null) {{
        this.val = val;
        this.next = next;
    }}
}}

function {m}(lists) {{
    // Write your code here
    return null;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const k = parseInt(input[0]);
        const lists = [];
        let idx = 1;
        for (let i = 0; i < k; i++) {{
            const m = parseInt(input[idx++]);
            const dummy = new ListNode(0);
            let curr = dummy;
            for (let j = 0; j < m; j++) {{
                curr.next = new ListNode(parseInt(input[idx++]));
                curr = curr.next;
            }}
            lists.push(dummy.next);
        }}
        let res = {m}(lists);
        const out = [];
        while (res) {{
            out.push(res.val);
            res = res.next;
        }}
        console.log(out.join(' '));
    }}
}}
main();"""

        elif t == "TREE_TO_TREE":
            java = f"""import java.util.*;

class TreeNode {{
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static TreeNode {m}(TreeNode root) {{
        // Write your code here
        return null;
    }}

    public static TreeNode buildTree(String[] arr) {{
        if (arr.length == 0 || arr[0].equals("null") || arr[0].equals("-1")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(arr[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {{
            TreeNode curr = q.poll();
            if (!arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.left = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.left);
            }}
            i++;
            if (i < arr.length && !arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.right = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.right);
            }}
            i++;
        }}
        return root;
    }}

    public static void printLevelOrder(TreeNode root) {{
        if (root == null) return;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        List<String> res = new ArrayList<>();
        while (!q.isEmpty()) {{
            TreeNode curr = q.poll();
            if (curr == null) {{
                res.add("-1");
            }} else {{
                res.add(String.valueOf(curr.val));
                q.add(curr.left);
                q.add(curr.right);
            }}
        }}
        // Trim trailing nulls
        int lastNum = res.size() - 1;
        while (lastNum >= 0 && res.get(lastNum).equals("-1")) lastNum--;
        for (int i = 0; i <= lastNum; i++) {{
            System.out.print(res.get(i) + (i == lastNum ? "" : " "));
        }}
        System.out.println();
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] arr = new String[n];
            for (int i = 0; i < n; i++) arr[i] = sc.next();
            TreeNode root = buildTree(arr);
            TreeNode res = {m}(root);
            printLevelOrder(res);
        }}
    }}
}}"""
            python = f"""import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def {m}(root):
    # Write your code here
    return None

def buildTree(arr):
    if not arr or arr[0] == 'null' or arr[0] == '-1': return None
    root = TreeNode(int(arr[0]))
    q = [root]
    i = 1
    while q and i < len(arr):
        curr = q.pop(0)
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.left = TreeNode(int(arr[i]))
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.right = TreeNode(int(arr[i]))
            q.append(curr.right)
        i += 1
    return root

def printLevelOrder(root):
    if not root: return
    q = [root]
    res = []
    while q:
        curr = q.pop(0)
        if not curr:
            res.append("-1")
        else:
            res.append(str(curr.val))
            q.append(curr.left)
            q.append(curr.right)
    while res and res[-1] == "-1":
        res.pop()
    print(*(res))

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        arr = input_data[1:n+1]
        root = buildTree(arr)
        res = {m}(root)
        printLevelOrder(res)"""
            js = f"""const fs = require('fs');

class TreeNode {{
    constructor(val, left = null, right = null) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}

function {m}(root) {{
    // Write your code here
    return null;
}}

function buildTree(arr) {{
    if (arr.length === 0 || arr[0] === 'null' || arr[0] === '-1') return null;
    const root = new TreeNode(parseInt(arr[0]));
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {{
        const curr = q.shift();
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.left = new TreeNode(parseInt(arr[i]));
            q.push(curr.left);
        }}
        i++;
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.right = new TreeNode(parseInt(arr[i]));
            q.push(curr.right);
        }}
        i++;
    }}
    return root;
}}

function printLevelOrder(root) {{
    if (!root) return;
    const q = [root];
    const res = [];
    while (q.length > 0) {{
        const curr = q.shift();
        if (!curr) {{
            res.push("-1");
        }} else {{
            res.push(curr.val.toString());
            q.push(curr.left);
            q.push(curr.right);
        }}
    }}
    while (res.length > 0 && res[res.length - 1] === "-1") res.pop();
    console.log(res.join(' '));
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const arr = input.slice(1, n + 1);
        const root = buildTree(arr);
        const res = {m}(root);
        printLevelOrder(res);
    }}
}}
main();"""

        elif t in ["TREE_TO_INT", "TREE_TO_BOOL"]:
            java = f"""import java.util.*;

class TreeNode {{
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static {"int" if t == "TREE_TO_INT" else "boolean"} {m}(TreeNode root) {{
        // Write your code here
        return {"0" if t == "TREE_TO_INT" else "false"};
    }}

    public static TreeNode buildTree(String[] arr) {{
        if (arr.length == 0 || arr[0].equals("null") || arr[0].equals("-1")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(arr[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {{
            TreeNode curr = q.poll();
            if (!arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.left = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.left);
            }}
            i++;
            if (i < arr.length && !arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.right = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.right);
            }}
            i++;
        }}
        return root;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] arr = new String[n];
            for (int i = 0; i < n; i++) arr[i] = sc.next();
            TreeNode root = buildTree(arr);
            System.out.println({m}(root));
        }}
    }}
}}"""
            python = f"""import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def {m}(root):
    # Write your code here
    return {"0" if t == "TREE_TO_INT" else "False"}

def buildTree(arr):
    if not arr or arr[0] == 'null' or arr[0] == '-1': return None
    root = TreeNode(int(arr[0]))
    q = [root]
    i = 1
    while q and i < len(arr):
        curr = q.pop(0)
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.left = TreeNode(int(arr[i]))
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.right = TreeNode(int(arr[i]))
            q.append(curr.right)
        i += 1
    return root

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        arr = input_data[1:n+1]
        root = buildTree(arr)
        res = {m}(root)
        print(str(res).lower() if type(res) == bool else res)"""
            js = f"""const fs = require('fs');

class TreeNode {{
    constructor(val, left = null, right = null) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}

function {m}(root) {{
    // Write your code here
    return {"0" if t == "TREE_TO_INT" else "false"};
}}

function buildTree(arr) {{
    if (arr.length === 0 || arr[0] === 'null' || arr[0] === '-1') return null;
    const root = new TreeNode(parseInt(arr[0]));
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {{
        const curr = q.shift();
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.left = new TreeNode(parseInt(arr[i]));
            q.push(curr.left);
        }}
        i++;
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.right = new TreeNode(parseInt(arr[i]));
            q.push(curr.right);
        }}
        i++;
    }}
    return root;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const arr = input.slice(1, n + 1);
        const root = buildTree(arr);
        console.log({m}(root));
    }}
}}
main();"""

        elif t == "TWO_TREES_TO_BOOL":
            java = f"""import java.util.*;

class TreeNode {{
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static boolean {m}(TreeNode p, TreeNode q) {{
        // Write your code here
        return false;
    }}

    public static TreeNode buildTree(String[] arr) {{
        if (arr.length == 0 || arr[0].equals("null") || arr[0].equals("-1")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(arr[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {{
            TreeNode curr = q.poll();
            if (!arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.left = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.left);
            }}
            i++;
            if (i < arr.length && !arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.right = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.right);
            }}
            i++;
        }}
        return root;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int m = sc.nextInt();
            String[] arr1 = new String[m];
            for (int i = 0; i < m; i++) arr1[i] = sc.next();
            TreeNode p = buildTree(arr1);
            
            int n = sc.nextInt();
            String[] arr2 = new String[n];
            for (int i = 0; i < n; i++) arr2[i] = sc.next();
            TreeNode q = buildTree(arr2);
            
            System.out.println({m}(p, q) ? "true" : "false");
        }}
    }}
}}"""
            python = f"""import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def {m}(p, q):
    # Write your code here
    return False

def buildTree(arr):
    if not arr or arr[0] == 'null' or arr[0] == '-1': return None
    root = TreeNode(int(arr[0]))
    q = [root]
    i = 1
    while q and i < len(arr):
        curr = q.pop(0)
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.left = TreeNode(int(arr[i]))
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.right = TreeNode(int(arr[i]))
            q.append(curr.right)
        i += 1
    return root

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        m = int(input_data[0])
        arr1 = input_data[1:m+1]
        p = buildTree(arr1)
        
        n = int(input_data[m+1])
        arr2 = input_data[m+2:m+2+n]
        q = buildTree(arr2)
        
        print('true' if {m}(p, q) else 'false')"""
            js = f"""const fs = require('fs');

class TreeNode {{
    constructor(val, left = null, right = null) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}

function {m}(p, q) {{
    // Write your code here
    return false;
}}

function buildTree(arr) {{
    if (arr.length === 0 || arr[0] === 'null' || arr[0] === '-1') return null;
    const root = new TreeNode(parseInt(arr[0]));
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {{
        const curr = q.shift();
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.left = new TreeNode(parseInt(arr[i]));
            q.push(curr.left);
        }}
        i++;
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.right = new TreeNode(parseInt(arr[i]));
            q.push(curr.right);
        }}
        i++;
    }}
    return root;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const m = parseInt(input[0]);
        const arr1 = input.slice(1, m + 1);
        const p = buildTree(arr1);
        
        const n = parseInt(input[m + 1]);
        const arr2 = input.slice(m + 2, m + 2 + n);
        const q = buildTree(arr2);
        
        console.log({m}(p, q) ? 'true' : 'false');
    }}
}}
main();"""

        elif t == "TREE_LCA":
            java = f"""import java.util.*;

class TreeNode {{
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static TreeNode {m}(TreeNode root, TreeNode p, TreeNode q) {{
        // Write your code here
        return null;
    }}

    public static TreeNode buildTree(String[] arr) {{
        if (arr.length == 0 || arr[0].equals("null") || arr[0].equals("-1")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(arr[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {{
            TreeNode curr = q.poll();
            if (!arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.left = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.left);
            }}
            i++;
            if (i < arr.length && !arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.right = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.right);
            }}
            i++;
        }}
        return root;
    }}

    public static TreeNode findNode(TreeNode root, int val) {{
        if (root == null) return null;
        if (root.val == val) return root;
        TreeNode left = findNode(root.left, val);
        if (left != null) return left;
        return findNode(root.right, val);
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] arr = new String[n];
            for (int i = 0; i < n; i++) arr[i] = sc.next();
            TreeNode root = buildTree(arr);
            int pVal = sc.nextInt();
            int qVal = sc.nextInt();
            TreeNode p = findNode(root, pVal);
            TreeNode q = findNode(root, qVal);
            TreeNode lca = {m}(root, p, q);
            System.out.println(lca != null ? lca.val : "-1");
        }}
    }}
}}"""
            python = f"""import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def {m}(root, p, q):
    # Write your code here
    return None

def buildTree(arr):
    if not arr or arr[0] == 'null' or arr[0] == '-1': return None
    root = TreeNode(int(arr[0]))
    q = [root]
    i = 1
    while q and i < len(arr):
        curr = q.pop(0)
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.left = TreeNode(int(arr[i]))
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.right = TreeNode(int(arr[i]))
            q.append(curr.right)
        i += 1
    return root

def findNode(root, val):
    if not root: return None
    if root.val == val: return root
    left = findNode(root.left, val)
    if left: return left
    return findNode(root.right, val)

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        arr = input_data[1:n+1]
        root = buildTree(arr)
        pVal = int(input_data[n+1])
        qVal = int(input_data[n+2])
        p = findNode(root, pVal)
        q = findNode(root, qVal)
        lca = {m}(root, p, q)
        print(lca.val if lca else -1)"""
            js = f"""const fs = require('fs');

class TreeNode {{
    constructor(val, left = null, right = null) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}

function {m}(root, p, q) {{
    // Write your code here
    return null;
}}

function buildTree(arr) {{
    if (arr.length === 0 || arr[0] === 'null' || arr[0] === '-1') return null;
    const root = new TreeNode(parseInt(arr[0]));
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {{
        const curr = q.shift();
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.left = new TreeNode(parseInt(arr[i]));
            q.push(curr.left);
        }}
        i++;
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.right = new TreeNode(parseInt(arr[i]));
            q.push(curr.right);
        }}
        i++;
    }}
    return root;
}}

function findNode(root, val) {{
    if (!root) return null;
    if (root.val === val) return root;
    const left = findNode(root.left, val);
    if (left) return left;
    return findNode(root.right, val);
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const arr = input.slice(1, n + 1);
        const root = buildTree(arr);
        const pVal = parseInt(input[n + 1]);
        const qVal = parseInt(input[n + 2]);
        const p = findNode(root, pVal);
        const q = findNode(root, qVal);
        const lca = {m}(root, p, q);
        console.log(lca ? lca.val : -1);
    }}
}}
main();"""

        elif t == "TREE_TO_LEVEL_ORDER":
            java = f"""import java.util.*;

class TreeNode {{
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static List<List<Integer>> {m}(TreeNode root) {{
        // Write your code here
        return new ArrayList<>();
    }}

    public static TreeNode buildTree(String[] arr) {{
        if (arr.length == 0 || arr[0].equals("null") || arr[0].equals("-1")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(arr[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {{
            TreeNode curr = q.poll();
            if (!arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.left = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.left);
            }}
            i++;
            if (i < arr.length && !arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.right = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.right);
            }}
            i++;
        }}
        return root;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] arr = new String[n];
            for (int i = 0; i < n; i++) arr[i] = sc.next();
            TreeNode root = buildTree(arr);
            List<List<Integer>> res = {m}(root);
            for (List<Integer> level : res) {{
                for (int i = 0; i < level.size(); i++) {{
                    System.out.print(level.get(i) + (i == level.size() - 1 ? "" : " "));
                }}
                System.out.println();
            }}
        }}
    }}
}}"""
            python = f"""import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def {m}(root):
    # Write your code here
    return []

def buildTree(arr):
    if not arr or arr[0] == 'null' or arr[0] == '-1': return None
    root = TreeNode(int(arr[0]))
    q = [root]
    i = 1
    while q and i < len(arr):
        curr = q.pop(0)
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.left = TreeNode(int(arr[i]))
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.right = TreeNode(int(arr[i]))
            q.append(curr.right)
        i += 1
    return root

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        arr = input_data[1:n+1]
        root = buildTree(arr)
        res = {m}(root)
        for level in res:
            print(*(level))"""
            js = f"""const fs = require('fs');

class TreeNode {{
    constructor(val, left = null, right = null) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}

function {m}(root) {{
    // Write your code here
    return [];
}}

function buildTree(arr) {{
    if (arr.length === 0 || arr[0] === 'null' || arr[0] === '-1') return null;
    const root = new TreeNode(parseInt(arr[0]));
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {{
        const curr = q.shift();
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.left = new TreeNode(parseInt(arr[i]));
            q.push(curr.left);
        }}
        i++;
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.right = new TreeNode(parseInt(arr[i]));
            q.push(curr.right);
        }}
        i++;
    }}
    return root;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const arr = input.slice(1, n + 1);
        const root = buildTree(arr);
        const res = {m}(root);
        for (const level of res) {{
            console.log(level.join(' '));
        }}
    }}
}}
main();"""

        elif t == "TREE_AND_VAL_TO_INT":
            java = f"""import java.util.*;

class TreeNode {{
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {{ this.val = val; }}
}}

public class Solution {{
    public static int {m}(TreeNode root, int k) {{
        // Write your code here
        return 0;
    }}

    public static TreeNode buildTree(String[] arr) {{
        if (arr.length == 0 || arr[0].equals("null") || arr[0].equals("-1")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(arr[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {{
            TreeNode curr = q.poll();
            if (!arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.left = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.left);
            }}
            i++;
            if (i < arr.length && !arr[i].equals("null") && !arr[i].equals("-1")) {{
                curr.right = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.right);
            }}
            i++;
        }}
        return root;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] arr = new String[n];
            for (int i = 0; i < n; i++) arr[i] = sc.next();
            TreeNode root = buildTree(arr);
            int k = sc.nextInt();
            System.out.println({m}(root, k));
        }}
    }}
}}"""
            python = f"""import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def {m}(root, k):
    # Write your code here
    return 0

def buildTree(arr):
    if not arr or arr[0] == 'null' or arr[0] == '-1': return None
    root = TreeNode(int(arr[0]))
    q = [root]
    i = 1
    while q and i < len(arr):
        curr = q.pop(0)
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.left = TreeNode(int(arr[i]))
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != 'null' and arr[i] != '-1':
            curr.right = TreeNode(int(arr[i]))
            q.append(curr.right)
        i += 1
    return root

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        arr = input_data[1:n+1]
        root = buildTree(arr)
        k = int(input_data[n+1])
        print({m}(root, k))"""
            js = f"""const fs = require('fs');

class TreeNode {{
    constructor(val, left = null, right = null) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}

function {m}(root, k) {{
    // Write your code here
    return 0;
}}

function buildTree(arr) {{
    if (arr.length === 0 || arr[0] === 'null' || arr[0] === '-1') return null;
    const root = new TreeNode(parseInt(arr[0]));
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {{
        const curr = q.shift();
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.left = new TreeNode(parseInt(arr[i]));
            q.push(curr.left);
        }}
        i++;
        if (i < arr.length && arr[i] !== 'null' && arr[i] !== '-1') {{
            curr.right = new TreeNode(parseInt(arr[i]));
            q.push(curr.right);
        }}
        i++;
    }}
    return root;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const arr = input.slice(1, n + 1);
        const root = buildTree(arr);
        const k = parseInt(input[n + 1]);
        console.log({m}(root, k));
    }}
}}
main();"""

        elif t == "KTH_LARGEST_STREAM":
            java = f"""import java.util.*;

public class Solution {{
    static class KthLargest {{
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        int k;

        public KthLargest(int k, int[] nums) {{
            this.k = k;
            for (int x : nums) add(x);
        }}
        public int add(int val) {{
            pq.offer(val);
            if (pq.size() > k) pq.poll();
            return pq.peek();
        }}
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int k = sc.nextInt();
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            KthLargest kl = new KthLargest(k, nums);
            int ops = sc.nextInt();
            for (int i = 0; i < ops; i++) {{
                String cmd = sc.next();
                if (cmd.equals("add")) {{
                    System.out.println(kl.add(sc.nextInt()));
                }}
            }}
        }}
    }}
}}"""
            python = f"""import sys
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list):
        self.k = k
        self.pq = []
        for x in nums: self.add(x)
    def add(self, val: int) -> int:
        heapq.heappush(self.pq, val)
        if len(self.pq) > self.k:
            heapq.heappop(self.pq)
        return self.pq[0]

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        k = int(input_data[0])
        n = int(input_data[1])
        nums = [int(x) for x in input_data[2:2+n]]
        kl = KthLargest(k, nums)
        ops = int(input_data[2+n])
        idx = 3+n
        for _ in range(ops):
            cmd = input_data[idx]
            idx += 1
            if cmd == 'add':
                print(kl.add(int(input_data[idx])))
                idx += 1"""
            js = f"""const fs = require('fs');

class KthLargest {{
    constructor(k, nums) {{
        this.k = k;
        this.nums = [];
        for (const x of nums) this.add(x);
    }}
    add(val) {{
        this.nums.push(val);
        this.nums.sort((a, b) => b - a); // descending
        if (this.nums.length > this.k) {{
            this.nums.pop();
        }}
        return this.nums[this.nums.length - 1];
    }}
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const k = parseInt(input[0]);
        const n = parseInt(input[1]);
        const nums = [];
        for (let i = 0; i < n; i++) nums.push(parseInt(input[2 + i]));
        const kl = new KthLargest(k, nums);
        const ops = parseInt(input[2 + n]);
        let idx = 3 + n;
        for (let i = 0; i < ops; i++) {{
            const cmd = input[idx++];
            if (cmd === 'add') {{
                console.log(kl.add(parseInt(input[idx++])));
            }}
        }}
    }}
}}
main();"""

        elif t == "POINTS_AND_VAL_TO_POINTS":
            java = f"""import java.util.*;

public class Solution {{
    public static int[][] {m}(int[][] points, int k) {{
        // Write your code here
        return new int[0][0];
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[][] points = new int[n][2];
            for (int i = 0; i < n; i++) {{
                points[i][0] = sc.nextInt();
                points[i][1] = sc.nextInt();
            }}
            int k = sc.nextInt();
            int[][] res = {m}(points, k);
            Arrays.sort(res, (a, b) -> a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]);
            for (int[] p : res) {{
                System.out.println(p[0] + " " + p[1]);
            }}
        }}
    }}
}}"""
            python = f"""import sys

def {m}(points, k):
    # Write your code here
    return []

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        points = []
        idx = 1
        for _ in range(n):
            points.append([int(input_data[idx]), int(input_data[idx+1])])
            idx += 2
        k = int(input_data[idx])
        res = {m}(points, k)
        res.sort(key=lambda x: (x[0], x[1]))
        for p in res:
            print(f"{{p[0]}} {{p[1]}}")"""
            js = f"""const fs = require('fs');

function {m}(points, k) {{
    // Write your code here
    return [];
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const points = [];
        let idx = 1;
        for (let i = 0; i < n; i++) {{
            points.push([parseInt(input[idx++]), parseInt(input[idx++])]);
        }}
        const k = parseInt(input[idx]);
        const res = {m}(points, k);
        res.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
        for (const p of res) {{
            console.log(p[0] + ' ' + p[1]);
        }}
    }}
}}
main();"""

        elif t == "TASKS_AND_VAL_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(char[] tasks, int n) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int len = sc.nextInt();
            char[] tasks = new char[len];
            for (int i = 0; i < len; i++) {{
                tasks[i] = sc.next().charAt(0);
            }}
            int n = sc.nextInt();
            System.out.println({m}(tasks, n));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(tasks, n):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        length = int(input_data[0])
        tasks = [x[0] for x in input_data[1:length+1]]
        n = int(input_data[length+1])
        print({m}(tasks, n))"""
            js = f"""const fs = require('fs');

function {m}(tasks, n) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const len = parseInt(input[0]);
        const tasks = [];
        for (let i = 0; i < len; i++) tasks.push(input[1 + i]);
        const n = parseInt(input[len+1]);
        console.log({m}(tasks, n));
    }}
}}
main();"""

        elif t == "TWITTER_DESIGN":
            java = f"""import java.util.*;

public class Solution {{
    static class Twitter {{
        // Simulating Twitter operations
        Map<Integer, Set<Integer>> follows = new HashMap<>();
        List<int[]> tweets = new ArrayList<>();

        public void postTweet(int userId, int tweetId) {{
            tweets.add(new int[]{{userId, tweetId}});
        }}
        public List<Integer> getNewsFeed(int userId) {{
            List<Integer> feed = new ArrayList<>();
            Set<Integer> f = follows.getOrDefault(userId, new HashSet<>());
            for (int i = tweets.size() - 1; i >= 0 && feed.size() < 10; i--) {{
                int[] t = tweets.get(i);
                if (t[0] == userId || f.contains(t[0])) {{
                    feed.add(t[1]);
                }}
            }}
            return feed;
        }}
        public void follow(int followerId, int followeeId) {{
            follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
        }}
        public void unfollow(int followerId, int followeeId) {{
            if (follows.containsKey(followerId)) follows.get(followerId).remove(followeeId);
        }}
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int ops = sc.nextInt();
            Twitter twitter = new Twitter();
            for (int i = 0; i < ops; i++) {{
                String cmd = sc.next();
                if (cmd.equals("postTweet")) {{
                    twitter.postTweet(sc.nextInt(), sc.nextInt());
                }} else if (cmd.equals("follow")) {{
                    twitter.follow(sc.nextInt(), sc.nextInt());
                }} else if (cmd.equals("unfollow")) {{
                    twitter.unfollow(sc.nextInt(), sc.nextInt());
                }} else if (cmd.equals("getNewsFeed")) {{
                    List<Integer> feed = twitter.getNewsFeed(sc.nextInt());
                    for (int j = 0; j < feed.size(); j++) {{
                        System.out.print(feed.get(j) + (j == feed.size() - 1 ? "" : " "));
                    }}
                    System.out.println();
                }}
            }}
        }}
    }}
}}"""
            python = f"""import sys

class Twitter:
    def __init__(self):
        self.tweets = []
        self.follows = {{}}
    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets.append((userId, tweetId))
    def getNewsFeed(self, userId: int) -> list:
        feed = []
        f = self.follows.get(userId, set())
        for u, t in reversed(self.tweets):
            if len(feed) == 10: break
            if u == userId or u in f:
                feed.append(t)
        return feed
    def follow(self, followerId: int, followeeId: int) -> None:
        if followerId not in self.follows: self.follows[followerId] = set()
        self.follows[followerId].add(followeeId)
    def unfollow(self, followerId: int, followeeId: int) -> None:
        if followerId in self.follows and followeeId in self.follows[followerId]:
            self.follows[followerId].remove(followeeId)

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        ops = int(input_data[0])
        twitter = Twitter()
        idx = 1
        for _ in range(ops):
            cmd = input_data[idx]
            idx += 1
            if cmd == 'postTweet':
                twitter.postTweet(int(input_data[idx]), int(input_data[idx+1]))
                idx += 2
            elif cmd == 'follow':
                twitter.follow(int(input_data[idx]), int(input_data[idx+1]))
                idx += 2
            elif cmd == 'unfollow':
                twitter.unfollow(int(input_data[idx]), int(input_data[idx+1]))
                idx += 2
            elif cmd == 'getNewsFeed':
                feed = twitter.getNewsFeed(int(input_data[idx]))
                print(*(feed))
                idx += 1"""
            js = f"""const fs = require('fs');

class Twitter {{
    constructor() {{
        this.tweets = [];
        this.follows = new Map();
    }}
    postTweet(userId, tweetId) {{
        this.tweets.push({{ u: userId, t: tweetId }});
    }}
    getNewsFeed(userId) {{
        const feed = [];
        const f = this.follows.get(userId) || new Set();
        for (let i = this.tweets.length - 1; i >= 0 && feed.length < 10; i--) {{
            const t = this.tweets[i];
            if (t.u === userId || f.has(t.u)) {{
                feed.push(t.t);
            }}
        }}
        return feed;
    }}
    follow(followerId, followeeId) {{
        if (!this.follows.has(followerId)) this.follows.set(followerId, new Set());
        this.follows.get(followerId).add(followeeId);
    }}
    unfollow(followerId, followeeId) {{
        if (this.follows.has(followerId)) this.follows.get(followerId).delete(followeeId);
    }}
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const ops = parseInt(input[0]);
        const twitter = new Twitter();
        let idx = 1;
        for (let i = 0; i < ops; i++) {{
            const cmd = input[idx++];
            if (cmd === 'postTweet') {{
                twitter.postTweet(parseInt(input[idx++]), parseInt(input[idx++]));
            }} else if (cmd === 'follow') {{
                twitter.follow(parseInt(input[idx++]), parseInt(input[idx++]));
            }} else if (cmd === 'unfollow') {{
                twitter.unfollow(parseInt(input[idx++]), parseInt(input[idx++]));
            }} else if (cmd === 'getNewsFeed') {{
                const feed = twitter.getNewsFeed(parseInt(input[idx++]));
                console.log(feed.join(' '));
            }}
        }}
    }}
}}
main();"""

        elif t == "MEDIAN_STREAM":
            java = f"""import java.util.*;

public class Solution {{
    static class MedianFinder {{
        PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> large = new PriorityQueue<>();

        public void addNum(int num) {{
            small.offer(num);
            large.offer(small.poll());
            if (small.size() < large.size()) {{
                small.offer(large.poll());
            }}
        }}
        public double findMedian() {{
            if (small.size() > large.size()) return small.peek();
            return (small.peek() + large.peek()) / 2.0;
        }}
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int ops = sc.nextInt();
            MedianFinder mf = new MedianFinder();
            for (int i = 0; i < ops; i++) {{
                String cmd = sc.next();
                if (cmd.equals("addNum")) {{
                    mf.addNum(sc.nextInt());
                }} else if (cmd.equals("findMedian")) {{
                    System.out.println(mf.findMedian());
                }}
            }}
        }}
    }}
}}"""
            python = f"""import sys
import heapq

class MedianFinder:
    def __init__(self):
        self.small = [] # max heap
        self.large = [] # min heap
    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        ops = int(input_data[0])
        mf = MedianFinder()
        idx = 1
        for _ in range(ops):
            cmd = input_data[idx]
            idx += 1
            if cmd == 'addNum':
                mf.addNum(int(input_data[idx]))
                idx += 1
            elif cmd == 'findMedian':
                print(mf.findMedian())"""
            js = f"""const fs = require('fs');

class MedianFinder {{
    constructor() {{
        this.arr = [];
    }}
    addNum(num) {{
        let l = 0, r = this.arr.length - 1;
        while (l <= r) {{
            const mid = Math.floor((l + r) / 2);
            if (this.arr[mid] < num) l = mid + 1;
            else r = mid - 1;
        }}
        this.arr.splice(l, 0, num);
    }}
    findMedian() {{
        const len = this.arr.length;
        if (len % 2 === 1) return this.arr[Math.floor(len / 2)];
        return (this.arr[len / 2 - 1] + this.arr[len / 2]) / 2;
    }}
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const ops = parseInt(input[0]);
        const mf = new MedianFinder();
        let idx = 1;
        for (let i = 0; i < ops; i++) {{
            const cmd = input[idx++];
            if (cmd === 'addNum') {{
                mf.addNum(parseInt(input[idx++]));
            }} else if (cmd === 'findMedian') {{
                console.log(mf.findMedian().toFixed(1));
            }}
        }}
    }}
}}
main();"""

        elif t == "WORDS_AND_VAL_TO_WORDS":
            java = f"""import java.util.*;

public class Solution {{
    public static List<String> {m}(String[] words, int k) {{
        // Write your code here
        return new ArrayList<>();
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            String[] words = new String[n];
            for (int i = 0; i < n; i++) words[i] = sc.next();
            int k = sc.nextInt();
            List<String> res = {m}(words, k);
            for (int i = 0; i < res.size(); i++) {{
                System.out.print(res.get(i) + (i == res.size() - 1 ? "" : " "));
            }}
            System.out.println();
        }}
    }}
}}"""
            python = f"""import sys

def {m}(words, k):
    # Write your code here
    return []

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        words = input_data[1:n+1]
        k = int(input_data[n+1])
        res = {m}(words, k)
        print(*(res))"""
            js = f"""const fs = require('fs');

function {m}(words, k) {{
    // Write your code here
    return [];
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const words = input.slice(1, n + 1);
        const k = parseInt(input[n+1]);
        const res = {m}(words, k);
        console.log(res.join(' '));
    }}
}}
main();"""

        elif t == "BUILDING_LADDERS_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(int[] heights, int bricks, int ladders) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            int[] heights = new int[n];
            for (int i = 0; i < n; i++) heights[i] = sc.nextInt();
            int bricks = sc.nextInt();
            int ladders = sc.nextInt();
            System.out.println({m}(heights, bricks, ladders));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(heights, bricks, ladders):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        heights = [int(x) for x in input_data[1:n+1]]
        bricks = int(input_data[n+1])
        ladders = int(input_data[n+2])
        print({m}(heights, bricks, ladders))"""
            js = f"""const fs = require('fs');

function {m}(heights, bricks, ladders) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        const heights = [];
        for (let i = 0; i < n; i++) heights.push(parseInt(input[1 + i]));
        const bricks = parseInt(input[n+1]);
        const ladders = parseInt(input[n+2]);
        console.log({m}(heights, bricks, ladders));
    }}
}}
main();"""

        elif t == "GRID_WORD_TO_BOOL":
            java = f"""import java.util.*;

public class Solution {{
    public static boolean {m}(char[][] board, String word) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int r = sc.nextInt();
            int c = sc.nextInt();
            char[][] board = new char[r][c];
            for (int i = 0; i < r; i++) {{
                for (int j = 0; j < c; j++) {{
                    board[i][j] = sc.next().charAt(0);
                }}
            }}
            String word = sc.next();
            System.out.println({m}(board, word) ? "true" : "false");
        }}
    }}
}}"""
            python = f"""import sys

def {m}(board, word):
    # Write your code here
    return False

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        r = int(input_data[0])
        c = int(input_data[1])
        board = []
        idx = 2
        for _ in range(r):
            board.append([x[0] for x in input_data[idx:idx+c]])
            idx += c
        word = input_data[idx]
        print('true' if {m}(board, word) else 'false')"""
            js = f"""const fs = require('fs');

function {m}(board, word) {{
    // Write your code here
    return false;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const r = parseInt(input[0]);
        const c = parseInt(input[1]);
        const board = [];
        let idx = 2;
        for (let i = 0; i < r; i++) {{
            const row = [];
            for (let j = 0; j < c; j++) {{
                row.push(input[idx++]);
            }}
            board.push(row);
        }}
        const word = input[idx];
        console.log({m}(board, word) ? 'true' : 'false');
    }}
}}
main();"""

        elif t == "STRING_TO_WORDS":
            java = f"""import java.util.*;

public class Solution {{
    public static List<String> {m}(String digits) {{
        // Write your code here
        return new ArrayList<>();
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        String digits = sc.hasNext() ? sc.next().trim() : "";
        List<String> res = {m}(digits);
        Collections.sort(res);
        for (int i = 0; i < res.size(); i++) {{
            System.out.print(res.get(i) + (i == res.size() - 1 ? "" : " "));
        }}
        System.out.println();
    }}
}}"""
            python = f"""import sys

def {m}(digits):
    # Write your code here
    return []

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    digits = input_data[0].strip() if input_data else ""
    res = {m}(digits)
    res.sort()
    print(*(res))"""
            js = f"""const fs = require('fs');

function {m}(digits) {{
    // Write your code here
    return [];
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    const digits = (input.length > 0 && input[0] !== '') ? input[0] : "";
    const res = {m}(digits);
    res.sort();
    console.log(res.join(' '));
}}
main();"""

        elif t == "SUDOKU_TO_BOOL":
            java = f"""import java.util.*;

public class Solution {{
    public static boolean {m}(char[][] board) {{
        // Write your code here
        return false;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        char[][] board = new char[9][9];
        for (int i = 0; i < 9; i++) {{
            for (int j = 0; j < 9; j++) {{
                board[i][j] = sc.next().charAt(0);
            }}
        }}
        System.out.println({m}(board) ? "true" : "false");
    }}
}}"""
            python = f"""import sys

def {m}(board):
    # Write your code here
    return False

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        board = []
        idx = 0
        for _ in range(9):
            board.append([x[0] for x in input_data[idx:idx+9]])
            idx += 9
        print('true' if {m}(board) else 'false')"""
            js = f"""const fs = require('fs');

function {m}(board) {{
    // Write your code here
    return false;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const board = [];
        let idx = 0;
        for (let i = 0; i < 9; i++) {{
            const row = [];
            for (let j = 0; j < 9; j++) {{
                row.push(input[idx++]);
            }}
            board.push(row);
        }}
        console.log({m}(board) ? 'true' : 'false');
    }}
}}
main();"""

        elif t == "INT_TO_INT":
            java = f"""import java.util.*;

public class Solution {{
    public static int {m}(int n) {{
        // Write your code here
        return 0;
    }}

    public static void main(String[] args) {{
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {{
            int n = sc.nextInt();
            System.out.println({m}(n));
        }}
    }}
}}"""
            python = f"""import sys

def {m}(n):
    # Write your code here
    return 0

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        print({m}(n))"""
            js = f"""const fs = require('fs');

function {m}(n) {{
    // Write your code here
    return 0;
}}

function main() {{
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length > 0 && input[0] !== '') {{
        const n = parseInt(input[0]);
        console.log({m}(n));
    }}
}}
main();"""

        else:
            # Fallback (ARRAY_TO_INT)
            java = f"""import java.util.*;
public class Solution {{
    public static int solve(int[] nums) {{ return 0; }}
    public static void main(String[] args) {{}}
}}"""
            python = f"""def solve(nums): return 0"""
            js = f"""function solve(nums) {{ return 0; }}"""

        return {"java": java, "python": python, "javascript": js}

    # Generate the problem description with dynamic formatting info
    def get_description(p):
        t = p["type"]
        desc = p["desc"]

        input_fmt = ""
        output_fmt = ""

        if t in ["ARRAY_TO_INT", "ARRAY_TO_BOOL", "ARRAY_TO_ARRAY"]:
            input_fmt = "- First line: `N`, size of input array.\n- Second line: `N` space-separated integers representing the array elements."
            output_fmt = "- Print the output (integer, boolean string, or space-separated array output)."
        elif t == "TWO_STRINGS_TO_BOOL":
            input_fmt = "- First line: String `s`.\n- Second line: String `t`."
            output_fmt = "- Print `true` if condition matches, otherwise `false`."
        elif t in ["ARRAY_AND_VAL_TO_ARRAY", "ARRAY_AND_VAL_TO_INT", "ARRAY_AND_VAL_TO_BOOL"]:
            input_fmt = "- First line: `N`, size of input array.\n- Second line: `N` space-separated integers representing the array.\n- Third line: An integer value (representing parameter `k`, `target`, or `value`)."
            output_fmt = "- Print the corresponding return value."
        elif t == "ARRAY_OF_STRINGS_TO_INT":
            input_fmt = "- First line: `N`, size of input array.\n- Second line: `N` space-separated strings."
            output_fmt = "- Print the resulting integer count."
        elif t in ["STRING_TO_BOOL", "STRING_TO_STRING", "STRING_TO_INT", "STRING_TO_WORDS"]:
            input_fmt = "- A single line representing string `s`."
            output_fmt = "- Print the output (boolean string, reversed string, integer, or space-separated words)."
        elif t in ["TWO_STRINGS_TO_STRING", "TWO_STRINGS_TO_ARRAY"]:
            input_fmt = "- First line: String `s`.\n- Second line: String `t` (or `p`)."
            output_fmt = "- Print the corresponding result."
        elif t == "ARRAY_AND_TWO_VALS_TO_INT":
            input_fmt = "- First line: `N`, size of input array.\n- Second line: `N` space-separated integers.\n- Third line: Two space-separated integers representing the query values."
            output_fmt = "- Print the integer result."
        elif t == "TWO_ARRAYS_TO_ARRAY":
            input_fmt = "- First line: Two space-separated integers `m` and `n`.\n- Second line: `m` space-separated integers.\n- Third line: `n` space-separated integers."
            output_fmt = "- Print the merged space-separated array elements."
        elif t == "STACK_OPERATIONS":
            input_fmt = "- First line: `Q`, number of operations.\n- Next `Q` lines: Operation commands (e.g. `push X`, `pop`, `top`, `getMin`)."
            output_fmt = "- Print results of query operations (`top`, `getMin`) each on a new line."
        elif t == "QUEUE_OPERATIONS":
            input_fmt = "- First line: `Q`, number of operations.\n- Next `Q` lines: Operation commands (e.g. `push X`, `pop`, `peek`, `empty`)."
            output_fmt = "- Print results of query operations (`peek`, `empty`) each on a new line."
        elif t == "INT_TO_LIST_OF_STRINGS":
            input_fmt = "- A single integer `n`."
            output_fmt = "- Print space-separated well-formed string outputs."
        elif t == "CAR_FLEET":
            input_fmt = "- First line: Target milestone value.\n- Second line: `N` car positions.\n- Third line: `N` car speeds."
            output_fmt = "- Print the number of car fleets reaching the destination."
        elif t == "MATRIX_SEARCH":
            input_fmt = "- First line: `R` and `C` (rows and columns).\n- Next `R` lines: `C` space-separated integers.\n- Last line: Target value to search."
            output_fmt = "- Print `true` or `false`."
        elif t == "TIME_STORE":
            input_fmt = "- First line: `Q`, number of operations.\n- Next `Q` lines: Operations (`set key val ts` or `get key ts`)."
            output_fmt = "- Print results of `get` operations on a new line."
        elif t == "TWO_ARRAYS_TO_DOUBLE":
            input_fmt = "- First line: Two space-separated integers `m` and `n`.\n- Second line: `m` space-separated integers.\n- Third line: `n` space-separated integers."
            output_fmt = "- Print the median value as a double (e.g. `2.5`)."
        elif t in ["LIST_TO_LIST", "LIST_TO_BOOL", "LIST_AND_VAL_TO_LIST"]:
            input_fmt = "- First line: `N`, size of linked list.\n- Second line: `N` space-separated integers.\n- Third line (optional): Target parameter value."
            output_fmt = "- Print the modified linked list elements space-separated, or `true`/`false`."
        elif t == "LIST_AND_LIST_TO_LIST":
            input_fmt = "- First line: `M`, size of first list.\n- Second line: `M` space-separated integers.\n- Third line: `N`, size of second list.\n- Fourth line: `N` space-separated integers."
            output_fmt = "- Print the resulting merged linked list elements space-separated."
        elif t == "LRU_CACHE":
            input_fmt = "- First line: Cache capacity.\n- Second line: `Q` (number of operations).\n- Next `Q` lines: operations (`put key val` or `get key`)."
            output_fmt = "- Print results of `get` operations each on a new line."
        elif t == "LIST_OF_LISTS_TO_LIST":
            input_fmt = "- First line: `K`, number of lists.\n- Next `K` pairs of lines: Size `M` followed by `M` integers."
            output_fmt = "- Print the merged sorted linked list elements space-separated."
        elif t in ["TREE_TO_TREE", "TREE_TO_INT", "TREE_TO_BOOL", "TREE_TO_LEVEL_ORDER", "TREE_AND_VAL_TO_INT"]:
            input_fmt = "- First line: `N`, size of array.\n- Second line: `N` space-separated elements representing Level-Order tree serialization (use -1 or null for empty nodes)."
            output_fmt = "- Print the resulting traversal, integer, or boolean value."
        elif t == "TWO_TREES_TO_BOOL":
            input_fmt = "- First line: `M`, size of first tree.\n- Second line: `M` level-order elements.\n- Third line: `N`, size of second tree.\n- Fourth line: `N` level-order elements."
            output_fmt = "- Print `true` or `false`."
        elif t == "TREE_LCA":
            input_fmt = "- First line: `N` level-order elements.\n- Second line: Target node value `p`.\n- Third line: Target node value `q`."
            output_fmt = "- Print the LCA node value."
        elif t == "KTH_LARGEST_STREAM":
            input_fmt = "- First line: integer `k`.\n- Second line: `N` elements to initialize.\n- Third line: `Q` operations count.\n- Next `Q` lines: `add X` commands."
            output_fmt = "- Print the `k`th largest element after each add operation."
        elif t == "POINTS_AND_VAL_TO_POINTS":
            input_fmt = "- First line: `N` points.\n- Next `N` lines: two space-separated integers.\n- Last line: integer `k`."
            output_fmt = "- Print the `k` closest points, each on a new line."
        elif t == "TASKS_AND_VAL_TO_INT":
            input_fmt = "- First line: `N` tasks.\n- Second line: `N` space-separated characters.\n- Third line: cooling interval `n`."
            output_fmt = "- Print least units of CPU time."
        elif t == "TWITTER_DESIGN":
            input_fmt = "- First line: `Q` operations.\n- Next `Q` lines: Twitter commands."
            output_fmt = "- Print results of getNewsFeed operations."
        elif t == "MEDIAN_STREAM":
            input_fmt = "- First line: `Q` operations.\n- Next `Q` lines: addNum or findMedian operations."
            output_fmt = "- Print median results each on a new line."
        elif t == "WORDS_AND_VAL_TO_WORDS":
            input_fmt = "- First line: `N` words.\n- Second line: `N` space-separated strings.\n- Third line: integer `k`."
            output_fmt = "- Print `k` most frequent words space-separated."
        elif t == "BUILDING_LADDERS_TO_INT":
            input_fmt = "- First line: `N` building heights.\n- Second line: space-separated heights.\n- Third line: bricks count and ladders count."
            output_fmt = "- Print furthest building index reached."
        elif t == "GRID_WORD_TO_BOOL":
            input_fmt = "- First line: `R` and `C` (grid rows/cols).\n- Next `R` lines: grid characters.\n- Last line: word to search."
            output_fmt = "- Print `true` or `false`."
        elif t == "SUDOKU_TO_BOOL":
            input_fmt = "- 9 lines, each containing 9 space-separated Sudoku cell values (use `.` for empty cells)."
            output_fmt = "- Print `true` or `false` based on solvability."
        elif t == "INT_TO_INT":
            input_fmt = "- A single integer `n`."
            output_fmt = "- Print the integer result."
        else:
            input_fmt = "- Standard competitive programming inputs."
            output_fmt = "- Print the solution."

        return f"{desc}\n\n### Input Format\n{input_fmt}\n\n### Output Format\n{output_fmt}"

    # Build the full list of problems
    for p in specs:
        p["description"] = get_description(p)
        p["starter_code"] = get_starter_code(p)
        problems.append(p)

    # Clear table first then insert
    sql_statements = [
        "USE technocrate_db;\n",
        "TRUNCATE TABLE progress_tracking;\n",
        "DELETE FROM coding_problems;\n"
    ]

    for p in problems:
        t_cases_str = json.dumps(p["test_cases"]).replace('\\', '\\\\').replace("'", "''")
        starter_str = json.dumps(p["starter_code"]).replace('\\', '\\\\').replace("'", "''")
        desc_escaped = escape_sql(p["description"])
        stmt = f"INSERT INTO coding_problems (title, description, difficulty, company_id, test_cases, starter_code) VALUES ('{escape_sql(p['title'])}', '{desc_escaped}', '{p['difficulty']}', {p['company_id']}, '{t_cases_str}', '{starter_str}');\n"
        sql_statements.append(stmt)

    with open("backend/src/main/resources/db/migration/V9__seed_100_dsa_problems.sql", "w", encoding="utf-8") as f:
        f.writelines(sql_statements)

    print("Successfully generated SQL with", len(problems), "problems.")

if __name__ == '__main__':
    generate()
