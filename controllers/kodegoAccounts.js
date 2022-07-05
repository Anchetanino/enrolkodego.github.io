const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken')
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE
})

exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('login', { message: 'Provide Email or Password' })
        }
        db.query('SELECT * from admin where email = ?', email, async(err, result) => {
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                return res.status(401).render('login', { message: 'Email or Password is incorrect.' });
            } else {
                const id = result[0].id;
                const token = jwt.sign(id, process.env.JWT_SECRET);
                const cookieOption = { expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000), httpOnly: true }
                console.log(token)
                res.cookie("access_token", token, cookieOption)
                db.query('SELECT * FROM student a join courses b on a.course_id = b.id ', (error, results) => {
                    if (error) {
                        console.log(error.message)
                    } else {
                        res.render('list', { users: results, title: 'List of Students' });
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// exports.list = (req, res) => {
//     db.query('SELECT * FROM student a join courses b on a.course_id = b.id ', (error, results) => {
//         if (error) {
//             console.log(error.message)
//         } else {
//             res.render('list', { users: results, title: 'List of Students' });
//         }
//     })
// }

exports.register = (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    db.query('SELECT email FROM admin where email=?', email, async(err, result) => {
        if (err) console.log(err.message)

        if (result.length > 0) {
            return res.render('register', { message: "Email already been used" });
        } else if (password !== confirmPassword) {
            return res.render('register', { message: "Password and Confrim Password does not match!" })
        } else {
            const hashPWD = await bcrypt.hash(password, 8);
            db.query('INSERT INTO admin SET ?', { first_name: firstName, last_name: lastName, email: email, password: hashPWD }, (err, result) => {
                if (err) console.log(err.message)
                else {
                    return res.render('register', { message: "User Registered" })
                }

            })

        }

    })
}

exports.add = (req, res) => {
    const { firstName, lastName, email, course_id } = req.body;
    db.query('SELECT email FROM student where email=?', email, async(err, result) => {
        if (err) console.log(err.message)

        if (result.length > 0) {
            return res.render('add', { message: "Email already been used" });
        } else {
            db.query('INSERT INTO student SET ?', { first_name: firstName, last_name: lastName, email: email, course_id: course_id }, (err, result) => {
                if (err) console.log(err.message)
                else {
                    db.query('SELECT * FROM student a join courses b on a.course_id = b.id ', (error, results) => {
                        if (error) {
                            console.log(error.message)
                        } else {
                            res.render('list', { users: results, title: 'List of Students' });
                        }
                    })
                }
            });
        }

    })
}

exports.deleteuser = (req, res) => {
    const email = req.params.email;
    // console.log(email);
    db.query("DELETE from student where email = ?", email, (err, results) => {
        if (err) {
            console.log(err.message)
        }
        db.query('SELECT * FROM student a join courses b on a.course_id = b.id ', (error, results) => {
            if (error) {
                console.log(error.message)
            } else {
                res.render('list', { users: results, title: 'List of Students' });
                console.log("Deleted");
            }
        })

    });
};

exports.update = (req, res) => {
    const email = req.params.email;
    db.query('SELECT * FROM student a join courses b on a.course_id = b.id  where email = ?', email, (error, results) => {
            if (error) {
                console.log(error.message)
            } else {
                res.render('update-form', { users: results, title: 'Update User' })
                db.query('SELECT * FROM student a join courses b on a.course_id = b.id ', (error, results) => {
                    if (error) {
                        console.log(error.message)
                    } else {
                        res.render('list', { users: results, title: 'List of Students' });
                    }
                })

            }
        })
        // 
}

exports.updateuser = (req, res) => {
    const { email, firstName, lastName, course_id, id } = req.body;
    db.query('UPDATE student set first_name = ?, last_name = ?, course_id = ? where id = ?', [firstName, lastName, course_id, id], (err, results) => {
        console.log("Updated");
        db.query('SELECT * FROM student a join courses b on a.course_id = b.id ', (error, results) => {
            if (error) {
                console.log(error.message)
            } else {
                res.render('list', { users: results, title: 'List of Students' });
                console.log("Updated");
            }
        })


    })
}