const express = require('express');
const auth = require('../authorization');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Course = require('../../models/Course');
const User = require('../../models/User');
