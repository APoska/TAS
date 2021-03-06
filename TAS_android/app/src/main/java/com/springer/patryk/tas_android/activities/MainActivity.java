package com.springer.patryk.tas_android.activities;

import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.animation.AnimationUtils;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.Toast;

import com.springer.patryk.tas_android.R;
import com.springer.patryk.tas_android.SessionManager;
import com.springer.patryk.tas_android.fragments.CalendarFragment;
import com.springer.patryk.tas_android.fragments.CreateTaskFragment;

import butterknife.BindArray;
import butterknife.BindView;
import butterknife.ButterKnife;

public class MainActivity extends AppCompatActivity  {


    @BindView(R.id.mainFab)
    FloatingActionButton mainFab;
    @BindView(R.id.drawerLayout)
    DrawerLayout mNavigationDrawer;
    @BindView(R.id.left_drawer)
    ListView mDrawerList;
    @BindArray(R.array.drawer_items)
    String[] mDrawerItems;
    @BindView(R.id.tasksFabLayout)
    LinearLayout taskFabLayout;
    @BindView(R.id.meetingsFabLayout)
    LinearLayout meetingFabLayout;

    private SessionManager sessionManager;
    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        mContext=this;
        sessionManager = new SessionManager(mContext);
        mDrawerList.setAdapter(new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,mDrawerItems));
        mDrawerList.setOnItemClickListener(new DrawerListOnItemClickListener());
        mainFab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (taskFabLayout.getVisibility() == View.INVISIBLE) {
                    taskFabLayout.setVisibility(View.VISIBLE);
                    meetingFabLayout.setVisibility(View.VISIBLE);
                    mainFab.startAnimation(AnimationUtils.loadAnimation(mContext,R.anim.fab_rotate_in));
                    taskFabLayout.startAnimation(AnimationUtils.loadAnimation(mContext, R.anim.tasks_move_in));
                    meetingFabLayout.startAnimation(AnimationUtils.loadAnimation(mContext, R.anim.tasks_move_in));
                }
                else{
                    taskFabLayout.startAnimation(AnimationUtils.loadAnimation(mContext, R.anim.tasks_move_out));
                    meetingFabLayout.startAnimation(AnimationUtils.loadAnimation(mContext, R.anim.tasks_move_out));
                    mainFab.startAnimation(AnimationUtils.loadAnimation(mContext,R.anim.fab_rotate_out));
                    taskFabLayout.setVisibility(View.INVISIBLE);
                    meetingFabLayout.setVisibility(View.INVISIBLE);
                }

            }
        });
        taskFabLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getSupportFragmentManager()
                        .beginTransaction()
                        .replace(R.id.mainContent,new CreateTaskFragment(),null)
                        .addToBackStack(null)
                        .commit();
            }
        });
        getSupportFragmentManager().beginTransaction().add(R.id.mainContent, new CalendarFragment()).commit();
    }


    @Override
    public void onBackPressed() {
        if(getSupportFragmentManager().getBackStackEntryCount()==0) {
            new AlertDialog.Builder(this)
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .setTitle("Logout")
                    .setMessage("Are you sure you want to logout?")
                    .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            sessionManager.logout();
                            Log.v("Logout", sessionManager.getUserDetails().toString());
                            finish();
                        }

                    })
                    .setNegativeButton("Cancel", null)
                    .show();
        }
        else
            super.onBackPressed();
    }

    private class DrawerListOnItemClickListener implements android.widget.AdapterView.OnItemClickListener {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            selectItem(position);
        }

        public void selectItem(int itemPosition) {
            switch (itemPosition) {
                case 0:
                    Toast.makeText(mContext, "Wybrano Tasks", Toast.LENGTH_SHORT).show();
            }
        }
    }

    public void hideFabs(){
        if (taskFabLayout.getVisibility() == View.VISIBLE) {
            taskFabLayout.startAnimation(AnimationUtils.loadAnimation(mContext, R.anim.tasks_move_out));
            meetingFabLayout.startAnimation(AnimationUtils.loadAnimation(mContext, R.anim.tasks_move_out));
            mainFab.startAnimation(AnimationUtils.loadAnimation(mContext,R.anim.fab_rotate_out));
            taskFabLayout.setVisibility(View.INVISIBLE);
            meetingFabLayout.setVisibility(View.INVISIBLE);
        }
            mainFab.setVisibility(View.INVISIBLE);
    }

    public void showMainFab() {
        mainFab.setVisibility(View.VISIBLE);
    }
}
