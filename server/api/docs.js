const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const { check, validationResult } = require('express-validator');
const Doc = require('../../schema/DocSchema');

